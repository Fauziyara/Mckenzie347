import { rpc } from "./src/lib/indexer/arc-rpc";

async function main() {
  const decimals = await rpc("eth_call", [{ to: "0x911b4000d3422f482f4062a913885f7b035382df", data: "0x313ce567" }, "latest"]);
  console.log("WUSDC decimals:", parseInt(decimals, 16));
  const decimals2 = await rpc("eth_call", [{ to: "0x89b50855aa3be2f677cd6303cec089b5f319d72a", data: "0x313ce567" }, "latest"]);
  console.log("EURC decimals:", parseInt(decimals2, 16));
}

main().catch(console.error);
