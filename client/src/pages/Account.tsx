/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import { dummyAccountsData, PLATFORMS } from "../assets/assets";
import { PlusIcon } from "lucide-react";
import AccountList from "../components/AccountList";
import PlatformPickerModel from "../components/PlatformPickerModel";
import toast from "react-hot-toast";
import api from "../api/axios";

function Account() {
  const [accounts, setAccounts] = useState<any[]>([]);
  const [connecting, setConnecting] = useState<string | null>(null);
  const [showPlatformPicker, setShowPlatformPicker] = useState(false);

  const fetchAccounts = async (isSync= false, platform?: string | null, successMsg?:string) =>{
   try {
      if(isSync){
        const label = platform ? platform.charAt(0).toUpperCase() + platform.slice(1) : "Social Media"
        toast.loading(`Syncing ${label} account...`, {id: "sync"})
        await api.get("/api/oauth/sync")
        toast.success(successMsg || "Accounts synced!", {id: "sync"})
      }

      const {data}  = await api.get("/api/accounts")
      setAccounts(data)
      console.log(data)
   } catch (error: any) {
    toast.error(error.response?.data?.message || error?.message || "Faild to load accounts");
   }
  }

  useEffect(()=>{

    const params = new URLSearchParams(window.location.search)
    const 
  fetchAccounts()
  }, [])
 
  const handelConnect = async (platformId: string)=>{
    setConnecting(platformId)

    setTimeout(() => {
      setConnecting(null)
      setAccounts((prev)=> [...prev, dummyAccountsData[0]])
      setShowPlatformPicker(false)
    }, 1000);
  }

  const handleDisconnect = async (accountId: string) => {
    setAccounts(accounts.filter((a) => a._id !== accountId));
  };

  const connectedIds = accounts.map((a)=> a.platform)

  return (
    <div className="space-y-8 max-w-4xl">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-sm">
        <div>
          <h2 className="text-xl font-semibold text-slate-900">Connected Accounts</h2>
          <p className="text-sm text-slate-500 mt-0.5">
            {accounts.length} of {PLATFORMS.length} platforms connected
          </p>
        </div>

        <button
          onClick={() => setShowPlatformPicker(true)}
          className="flex items-center gap-2 px-5 py-2.5 bg-red-500 hover:bg-red-600 text-white rounded-full font-medium transition-all w-full sm:w-auto justify-center"
        >
          <PlusIcon className="size-4" /> Connect Account
        </button>
      </div>


      {showPlatformPicker && <PlatformPickerModel connectedIds={connectedIds} connecting={connecting}
      onClose={()=> setShowPlatformPicker(false)} onConnect={handelConnect}/>}

      <AccountList accounts={accounts} onDisconnect={handleDisconnect} />
    </div>
  );
}

export default Account;