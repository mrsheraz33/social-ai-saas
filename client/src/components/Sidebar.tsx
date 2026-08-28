import { CalendarDaysIcon, LayoutDashboardIcon, LogOut, UsersIcon, Wand2Icon } from "lucide-react";
import { NavLink, useLocation } from "react-router-dom";

type SidebarProps = {
  isOpen: boolean;
  setIsOpen: (val: boolean)=> void;
};

function Sidebar({isOpen, setIsOpen}:SidebarProps) {

  const location = useLocation()
  const navItems = [
    {name: "Dashboard" , icon: LayoutDashboardIcon, path: "/dashboard"},
    {name: "Accounts" , icon: UsersIcon, path: "/accounts"},
    {name: "Scheduler" , icon: CalendarDaysIcon, path: "/schedule"},
    {name: "AI Composer" , icon: Wand2Icon, path: "/ai-composer"}
  ]

  const {logout, user} ={
    logout: ()=>{
      window.location.href = "/"
    },

   user: {name: "sheraz", email: "sheraz@gmail.com"}

  }

  return (
    <div className={`fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-slate-200
    flex flex-col h-full transform transition-transform duration-200 ease-in-out md:relative md:translate-x-0
    ${isOpen ? "translate-x-0" : "translate-x-full"}`}>

<div className="p-6 pb-4">
<div className="text-xl tracking-tight text-slate-800 flex items-center gap-1.5">
  <img src="/logo.svg" alt="logo" className="size-6"/>
  Scheduler
</div>
</div>


<div className="px-6 py-2">
  <span className="text-xs text-slate-500 uppercase tracking-wide">Menu</span>
</div>

<nav className="flex-1 px-3 space-y-1">
{navItems.map((item)=>{
  const isActive = location.pathname === item.path
  return (
    <NavLink key={item.name} to={item.path} end={item.path === "/dashboard"}
      onClick={()=> setIsOpen(false)}

      className={`flex items-center gap-3 px-3 py-2.5 rounded text-sm transition-all
      duration-150 border ${isActive ? "bg-red-50 text-red-600 border-red-100"
      :"text-slate-500 hover:bg-slate-50 border-transparent hover:text-slate-700 "}`}>

      <item.icon className={`size-4.5 shrink-0 ${isActive ? "text-red-500": "text-slate-500"}`}/>
      {item.name}
      {isActive && <span className="ml-auto w-1.5 h-5 rounded-full bg-red-500"/>}
    </NavLink>
  )
})}
</nav>


<div className="p-4 border-t border-slate-100 ">
<div className="flex items-center gap-3 p-2 rounded-xl hover:bg-slate-50 transition-colors">
<div className="size-8 rounded-full bg-linear-to-br from-red-400 to-pink-400
flex items-center justify-center text-white text-sm font-medium shrink-0">
  {user?.name.charAt(0).toLocaleUpperCase() || "S"}
</div>

<div className="flex-1 min-w-0">
  <div className="text-sm text-slate-800 truncate">{user?.name}</div>
  <div  className="text-sm text-slate-400 truncate">{user?.email}</div>
</div>

</div>

<button className="mt-1 flex items-center gap-2 px-3 py-2 w-full rounded text-sm text-slate-500
hover:bg-red-50 hover:text-red-500 transition-all duration-150"
onClick={logout}>
  <LogOut className="size-4"/>
  Sign Out
</button>

</div>
    </div>
  )
}

export default Sidebar