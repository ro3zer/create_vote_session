import { useAbstractClient, useLoginWithAbstract } from "@abstract-foundation/agw-react";
import { generatePrivateKey, privateKeyToAccount } from "viem/accounts";
import { parseEther, toFunctionSelector } from "viem";

// ❌ 문제가 된 LimitType import 줄을 삭제했어!

export default function App() {
  const { login } = useLoginWithAbstract();
  const { data: agwClient } = useAbstractClient();

  async function handleCreateSession() {
    if (!agwClient) return alert("먼저 로그인 버튼을 눌러 지갑을 연결해주세요!");

    try {
      console.log("세션 키 발급 요청 중... 지갑 서명 팝업을 확인하세요!");
      
      const newSessionPrivateKey = generatePrivateKey();
      const sessionSigner = privateKeyToAccount(newSessionPrivateKey);

      const result = await agwClient.createSession({
        session: {
          signer: sessionSigner.address,
          expiresAt: BigInt(Math.floor(Date.now() / 1000) + 365 * 60 * 24 * 60), // 30일 뒤 만료
          feeLimit: {
            limitType: 1, // LimitType.Lifetime 대신 직접 문자열 입력
            limit: parseEther("0.1"), 
            period: BigInt(0),
          },
          callPolicies: [
            {
              target: "0x3B50dE27506f0a8C1f4122A1e6F470009a76ce2A",
              selector: toFunctionSelector("voteForApp(uint256)"),
              valueLimit: {
                limitType: 0, // LimitType.Unlimited 대신 직접 문자열 입력
                limit: BigInt(0),
                period: BigInt(0),
              },
              maxValuePerUse: parseEther("0.01"), 
              constraints: [],
            },
          ],
          transferPolicies: [],
        },
      });

      const sessionJson = JSON.stringify(result.session, (key, value) =>
        typeof value === "bigint" ? value.toString() : value
      );

      console.log("==========================================");
      console.log("✅ 1. .env에 넣을 PRIVATE_KEY:\n", newSessionPrivateKey);
      console.log("✅ 2. session.json에 넣을 설정값:\n", sessionJson);
      console.log("==========================================");
      
      alert("성공! 키보드 F12를 눌러 개발자 도구의 '콘솔(Console)' 창에서 데이터를 복사하세요.");

    } catch (error) {
      console.error("발급 실패:", error);
      alert("발급에 실패했습니다. 콘솔 에러를 확인해주세요.");
    }
  }

  return (
    <div style={{ padding: '50px', fontFamily: 'sans-serif' }}>
      <h1>🤖 투표 봇 세션 키 발급기</h1>
      {!agwClient ? (
        <button onClick={login} style={{ padding: '10px 20px', fontSize: '16px', cursor: 'pointer' }}>
          Abstract 지갑 로그인
        </button>
      ) : (
        <div>
          <p>✅ 지갑 연결됨: {agwClient.account.address}</p>
          <button onClick={handleCreateSession} style={{ padding: '10px 20px', fontSize: '16px', cursor: 'pointer', background: '#007bff', color: 'white', border: 'none', borderRadius: '5px' }}>
            🔑 365일 봇 전용 세션 키 발급받기
          </button>
          <p style={{ marginTop: '20px', color: '#666' }}>버튼을 누르면 2FA 승인 창이 뜹니다.</p>
        </div>
      )}
    </div>
  );
}