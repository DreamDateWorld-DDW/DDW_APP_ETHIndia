import {React, useState} from 'react'
import "./Profile.css"
import Select from 'react-dropdown-select'
import axios from 'axios'
import src from "../../Helper/dating_background.jpeg"
import uploadBox from "../../Helper/uploadBox.png"
import { useLocation, useNavigate } from 'react-router-dom';
import { write_to_ipfs } from '../../Helper/web3storage'
const Profile = () => {
    const navigate = useNavigate();
    const location = useLocation();

    const [imageFile, setImageFile] = useState(null);
    const [userDetails, setuserDetails] = useState({
        name: "location.state.name" , blockchain: "location.state.blockchain", id: "location.state.id", wallet: "location.state.wallet", bio: " ", interest: [], gender: " ", image: " ",

    });
    const [imageIPFS, setImageIPFS] = useState(null);
    const [infoIPFS, setInfoIPFS] = useState(null);
    const [selectedOptions, setSelectedOptions] = useState([])
    const handleInterest = async (values) => {
        setuserDetails({ ...userDetails, interest: values.map((el) => el.label) })
        setInfoIPFS(null)
    }
    const handleGender = async (values) => {
        setuserDetails({ ...userDetails, gender: values[0].label })
        setInfoIPFS(null)
    }

   
    let name, value;

    const handleInputs = async (e) => {
        e.preventDefault();
        name = e.target.name;
        value = e.target.value;
        setuserDetails({ ...userDetails, [name]: value })
        setInfoIPFS(null)
        
    }

    async function callbackFunction(event) {
        console.log(userDetails);
        var ipfs_cid = null;
        var info_ipfs_cid = null;
        if(!imageIPFS)
        {ipfs_cid = await write_to_ipfs([imageFile]);
        setImageIPFS(ipfs_cid);
        console.log("changed image IPFS", ipfs_cid);
        let userDetailsvalue = {...userDetails, "image": ipfs_cid};
        let contents = JSON.stringify(userDetailsvalue);
        let blob = new Blob([contents], { type: "application/json" });
        let file = new File([blob], "userInfo.json", { type: "application/json" });
        info_ipfs_cid = await write_to_ipfs([file]);
        setInfoIPFS(info_ipfs_cid);
        console.log("changed image and changed info IPFS", info_ipfs_cid);
        }
        else if(!infoIPFS) {
        ipfs_cid = imageIPFS;
        let userDetailsvalue = {...userDetails, "image": ipfs_cid};
        let contents = JSON.stringify(userDetailsvalue);
        let blob = new Blob([contents], { type: "application/json" });
        let file = new File([blob], "userInfo.json", { type: "application/json" });
        info_ipfs_cid = await write_to_ipfs([file]);
        setInfoIPFS(info_ipfs_cid);
        console.log("unchanged image and changed info IPFS", info_ipfs_cid);
        }
        else {
            info_ipfs_cid = infoIPFS;
            console.log("unchanged everything", info_ipfs_cid);
        }
        var isItRightWallet = true
        if(!isItRightWallet) {
            alert(`Wrong Wallet. You should switcht to ${userDetails.wallet}`);
            return;
        }
        var mongoData = {
            date: new Date(Date.now()),
            discordId: userDetails.id,
            discordName: userDetails.name,
            walletAddress: userDetails.wallet,
            blockchain: userDetails.blockchain,
        }
        var mongo_res = await axios.post(process.env.REACT_APP_MONGODB_API_ENDPOINT, mongoData, 
            {headers: {
              'Content-Type': 'application/json'
            }})
        
            console.log(mongo_res.status);
        var postData = {
            content: `OnRegister ${userDetails.id}`,
            username: "Webhook Message Sender",
            avatarURL: "foo.png"
      
          }
          var res = await axios.post(process.env.REACT_APP_DISCORD_WEBHOOK_URL, postData, 
            {headers: {
              'Content-Type': 'application/json'
            }})
          console.log(res.status);
        navigate("/Userdashboard", {state: {userDetails: userDetails, imageSrc: window.URL.createObjectURL(imageFile)}});
    }
    function previewImage() {
        var preview = document.querySelector('img');
        var file = document.querySelector('input[type=file]').files[0];
        var reader = new FileReader();

        reader.addEventListener("load", function () {
            preview.src = reader.result;
        }, false);

        if (file) {
            file = new File([file], 'avatar.png');
            console.log(file);
            setImageFile(file);
            setImageIPFS(null);
            reader.readAsDataURL(file);
        }
    }


    const options = [
        { id: 1, Interest: "Nightclubs" },
        { id: 2, Interest: "Whiskey" },
        { id: 3, Interest: "Indie" },
        { id: 4, Interest: "Hiking" },
    ]
    const genderOptions = [
        { id: 1, Gender: "Male" },
        { id: 2, Gender: "Female" },    ]

    const styles ={
        width : "150px",
        left : "15em",
        color : "blue",
        bottom : "2em",
        fontSize : "1.2em",
        background : ""
    }
  return (
    <>
        <div className="shade">
		<div className="blackboard">
				<form onSubmit={handleInputs} className="form">
                        <p id='uploadImageStyle' className='paragraphContext'>
                                <img src={src} alt="/" height="100" width="100" />
                                <label id='filelabel' style={{color:"black"}}>
                                <span className='hoverStyling' style={{marginRight: "1.2em"}}>Upload</span>
                                <img id='uploadbox' height={40} width={40} src={uploadBox} alt="uploadBox" />
                                <input id='filetypestyle' className='inputStyle' type="file" onChange={previewImage}/>
                                </label>
                        </p>
						<p className='paragraphContext'>
								<label className='labelValue hoverStyling'>Name: </label>
								<input className='inputStyle' type="text" />
						</p>
                        <label id='selectstyling' className='labelValue hoverStyling'>Interest: </label>
                        <Select  options={options.map((item, index) => {
                        return { value: item.id, label: item.Interest }
                        })}
                        values={selectedOptions} onChange={(values) => { setSelectedOptions([...values]); handleInterest(values)}}
                        style={styles}
                        multi= "true"
                        placeholder = "Interests" />
                        <label id='selectstyling' className='hoverStyling labelValue'>Gender: </label>
                        <Select  options={genderOptions.map((item, index) => {
                        return { value: item.id, label: item.Gender }
                        })}
                        values={selectedOptions} 
                        onChange={(values) => { setSelectedOptions([...values]); handleGender(values) }}
                        style={styles}
                        placeholder = "Gender" />
						<p className='paragraphContext'>
								<label className='hoverStyling labelValue'>Bio: </label>
								<textarea style={{	borderBottom: "1.5px solid rgb(7, 4, 4)"}} className='inputStyle' type="text" onChange={handleInputs} wrap='off' name="bio" />
						</p>
						<p className="wipeout paragraphContext">
								<input id='submitButtonStyle' className='inputStyle' onClick={callbackFunction} type="submit" value="Submit" />
						</p>
				</form>
		</div>
</div> 
    </>
  )
}

export default Profile