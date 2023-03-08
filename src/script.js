import IPFS from "ipfs-mini";

function uploadIPFS() {
  const ipfs = new IPFS({
    host: "ipfs.infura.io",
    port: 3000,
    protocol: "https",
  });
  const data = "imageUrl";
  ipfs.add(data, (err, hash) => {
    if (err) {
      return console.log(err);
    }
    console.log("https://ipfs.infura.io/ipfs/" + hash);
  });
}
