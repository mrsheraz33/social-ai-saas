import { CheckCircle, ClockIcon, Share2Icon } from "lucide-react"
import { useState } from "react"

function Dashboard() {

const [ stats , setStats] = useState({scheduled : 0 , published:0 , connectedAccount:0})
const [ activities, setActivities] = useState<any[]>([])

  const statCards = [
    {
      label: "Scheduled Posts",
      value: stats.scheduled,
      icon: ClockIcon,
      trend: "+2 today"
      },

          {
      label: "Published Post",
      value: stats.published,
      icon: CheckCircle,
      trend: "All time"
      },

          {
      label: "Connected Account",
      value: stats.connectedAccount,
      icon: Share2Icon,
      trend: "Active"
      },
   ]

  return (
    <div className="space-y-8">
    <div>
      <h2 className="text-2xl text-slate-900">Good morning!</h2>
      <p className="text-slate-500 text-sm mt-0.5">Here's what's happening with your social accounts today.</p>
    </div>


<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
{statCards.map((card)=>(
  <div key={card.label}
  className="bg-white hover:bg-red-50 relative border border-slate-200 rounded-2xl p-5 hover:border-red-200
  transition-all">
  <div className="flex items-center justify-between mb-4">
<div>{card.value}</div>
  </div>
  </div>
))}
</div>

    </div>
  )
}

export default Dashboard