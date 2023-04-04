/*const IPFS = require("ipfs-core");
const { Buffer } = require("buffer");
*/
import { Buffer } from "buffer";
import * as IPFS from "ipfs-core";
async function uploadIPFS() {
  const projectId = "2Nay8Qi2yLb8E82fm3e48pY50M2";
  const projectSecret = "b42e50c6b661a9284337a1bf64503a63";
  const auth =
    "Basic " + Buffer.from(projectId + ":" + projectSecret).toString("base64");
  const client = await IPFS.create({
    host: "ipfs.infura.io",
    port: 5001,
    protocol: "https",
    headers: {
      authorization: auth,
    },
  });
  const data = '@Url.Content("~/watchos-9-series-7-workout-progress.png")';
  const { cid } = await client.add(data);
  console.info(cid);
}
uploadIPFS();
