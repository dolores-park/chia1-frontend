import React, { useState, useEffect } from "react";
import "./App.css";
// import { Route, Switch, Redirect } from "react-router-dom";
// import { auth } from "./services/firebase";
// import { PrivateRoute, PublicRoute } from "./components/route/route";
import logo from "./logo.svg";

// Global Store
// import Store from "./context/store";

const ipfsClient = require('ipfs-http-client');

global.Buffer = global.Buffer || require('buffer').Buffer;

const projectId = '26U66BQ9I93byWz4KA1ngIJpcNF';
const projectSecret = '3eb95c238bf345e1c4dc0598eed24171';

const auth =
    'Basic ' + Buffer.from(projectId + ':' + projectSecret).toString('base64');

const client = ipfsClient.create({
    host: 'ipfs.infura.io',
    port: 5001,
    protocol: 'https',
    headers: {
        authorization: auth,
    },
});

function App() {

    const [file, setFile] = useState(null);
    const [urlArr, setUrlArr] = useState([]);

    const retrieveFile = (e) => {
        const data = e.target.files[0];
        const reader = new window.FileReader();
        reader.readAsArrayBuffer(data);
        reader.onloadend = () => {
            setFile(Buffer(reader.result));
        }
    
        e.preventDefault();  
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const created = await client.add(file);
            const url = `https://ipfs.infura.io/ipfs/${created.path}`;
            console.log(url);
            setUrlArr(prev => [...prev, url]);      
        } catch (error) {
            console.log(error.message);
        }
        };

    return (
        <div className="App">
          <form className="form" onSubmit={handleSubmit}>
            <input type="file" name="data" onChange={retrieveFile} />
            <button type="submit" className="btn">Upload file</button>
          </form>

            <div className="display">
                {urlArr.length !== 0
                ? urlArr.map((el) => <img src={el} alt="nfts" key={el}/>)
                : <h3>Upload data</h3>}
            </div>
        </div>
      )
}

export default App;
