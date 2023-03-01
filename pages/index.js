import Head from "next/head";
import "../flow/config";
import { useState, useEffect } from "react";
import * as fcl from "@onflow/fcl";

export default function Home() {
  const [user, setUser] = useState({ loggedIn: null });
  const [msg, setMsg] = useState();
  const [data, setData] = useState("");
  let data2 ="sjs"
  const [transactionStatus, setTransactionStatus] = useState(null); // NEW

  useEffect(() => fcl.currentUser.subscribe(setUser), []);

  //script
  const sendQuery = async () => {
    const profile = await fcl.query({
      cadence: `
      import hello2 from 0xProfile
        pub fun main(): String {
        return hello2.greeting
          }
      `,
    });

    setMsg(profile);
    console.log(profile);
  };

  //transaction
  const initAccount = async () => {
    const transactionId = await fcl.mutate({
      cadence: `
      import hello2 from 0xProfile

transaction (userInput : String){

  prepare(acct: AuthAccount) {}

  execute {
    hello2.changegreeting(newgreeting: userInput)
  }
}    
 `,
  args:(arg,t) =>[arg(data2, t.String)]
  ,
      payer: fcl.authz,
      proposer: fcl.authz,
      authorizations: [fcl.authz],
      limit: 50,
    });

    const transaction = await fcl.tx(transactionId).onceSealed();
    console.log(transaction);
    console.log(data2)
  };

  // NEW


  const newdata = (val)=>{
    data2 = val.target.value
    console.log(data2)
  }

  // ui buttons
  const AuthedState = () => {
    return (
      <div>
        <div>Address: {user?.addr ?? "No Address"}</div>
        <div>Profile Name: {name ?? "--"}</div>
        <h1>{msg}</h1>
        <div>Transaction Status: {transactionStatus ?? "--"}</div> {/* NEW */}
        <button onClick={sendQuery}>Run Query</button>
        <button onClick={initAccount}>Run Transaction</button>
        <button onClick={fcl.unauthenticate}>Log Out</button>
        <form onSubmit={(event) => event.preventDefault()}>
          <label>
            Name:
            <input type="text" name="name" onChange={newdata} />
          </label>
          <input type="submit" value="Upload on Chain"  onClick={initAccount} />
        </form>
        <h1></h1>
      </div>
    );
  };

  const UnauthenticatedState = () => {
    return (
      <div>
        <button onClick={fcl.logIn}>Log In</button>
        <button onClick={fcl.signUp}>Sign Up</button>
      </div>
    );
  };

  return (
    <div>
      <Head>
        <title>FCL Quickstart with NextJS</title>
        <meta name="description" content="My first web3 app on Flow!" />
        <link rel="icon" href="/favicon.png" />
      </Head>
      <h1>Flow App</h1>
      {user.loggedIn ? <AuthedState /> : <UnauthenticatedState />}
    </div>
  );
}
