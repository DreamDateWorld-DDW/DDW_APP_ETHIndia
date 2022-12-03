import { Web3Storage} from 'web3.storage'

export const read_from_ipfs = async (ipfs_cid) => {
    const storage = new Web3Storage({ token: process.env.REACT_APP_WEB3_STORAGE_API_TOKEN });
    var res = await storage.get(ipfs_cid);
    if(res.ok) {
        var files = await res.files();
        return files;
    }
    return null;

}

export const write_to_ipfs = async (files) => {
    const storage = new Web3Storage({ token: process.env.REACT_APP_WEB3_STORAGE_API_TOKEN });
    var ipfs_cid = await storage.put(files);
    return ipfs_cid;
}
