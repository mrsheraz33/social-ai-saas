import { useEffect, useState } from "react"
import { dummyGenerationData, PLATFORMS } from "../assets/assets"
import { ArrowRightIcon, Calendar1Icon, Clock1Icon, HistoryIcon, Loader2Icon, TimerIcon, WandIcon, XIcon } from "lucide-react"

function AIComposer() {
  const [prompt, setPrompt] = useState("")
  const [tone, setTone] = useState("Professional")
  const [generateImage, setGenerateImage] = useState(true)
  const [loading, setLoading] = useState(false)
  const [generations, setGenerations] = useState<any[]>([])
  
  const [activeScheduler, setActiveScheduler] = useState<any>(null)
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>([])
  const [scheduledDate, setScheduledDate] = useState("")
  const [scheduledTime, setScheduledTime] = useState("")

  const [scheduling, setScheduling] = useState(false)

  const fetchGenerations = async () => {
    setGenerations(dummyGenerationData)
  }

  useEffect(() => {
    fetchGenerations()
  }, [])

  const tones = [
    "Professional",
    "Casual",
    "Funny",
    "Creative",
    "Excited",
  ]

  const handleGenerate = async () => {
    setLoading(true)

    setTimeout(() => {
      setLoading(false)
    }, 2000)
  }

  const handleSchedule = async () => {
    setScheduling(true)

    setTimeout(() => {
      setScheduling(false)
      setActiveScheduler(null)
      setSelectedPlatforms([])
      setScheduledDate("")
      setScheduledTime("")
    }, 2000)
  }

  return (
    <div className="max-w-4xl mx-auto space-y-12 pb-20 animate-in fade-in duration-700">
      <div className="space-y-6 text-center mt-20">
        <h1 className="text-3xl text-slate-700 tracking-tight font-medium">What should we create today?</h1>
      </div>

      <div className="relative group mt-12">
        <textarea
          className="w-full px-6 py-6 bg-white border border-slate-300 rounded-xl text-slate-900 placeholder-slate-400 outline-none focus:border-slate-400 transition resize-none h-40"
          placeholder="Share your idea... (e.g., Big news! We are launching our new product today. Check it out now!)" 
          value={prompt} 
          onChange={(e) => setPrompt(e.target.value)}
        />

        <div className="absolute bottom-4 right-2.5 flex items-center gap-3 text-sm">
          <button 
            type="button"
            onClick={() => setGenerateImage(!generateImage)}
            className="flex items-center gap-3 bg-red-50 py-2 px-3 rounded-lg border border-red-100"
          >
            <span className="text-xs font-medium text-red-600">AI Image</span>
            <div className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full transition-colors duration-200 ease-in-out focus:outline-none ${generateImage ? "bg-red-500" : "bg-slate-200"}`}>
              <span className={`pointer-events-none size-4 transform translate-y-0.5 rounded-full bg-white transition ${generateImage ? "translate-x-4.5" : "translate-x-0.5"}`} />
            </div>
          </button>

          <button 
            type="button"
            onClick={handleGenerate}
            disabled={loading}
            className="bg-slate-900 hover:bg-slate-800 text-white flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors"
          >
            {loading ? (
              <>
                <Loader2Icon className="size-4 animate-spin" />
                <span>Generating...</span>
              </>
            ) : (
              <>
                <span>Generate</span>
                <ArrowRightIcon className="size-4" />
              </>
            )}
          </button>
        </div>
      </div>

      <div className="flex flex-wrap justify-center gap-2">
        {tones.map((t) => (
          <button 
            key={t} 
            type="button"
            onClick={() => setTone(t)}
            className={`px-4 py-1.5 rounded-full text-sm transition-all border ${
              tone === t 
                ? "bg-red-500 border-red-500 text-white font-medium"
                : "bg-white border-slate-200 text-slate-500 hover:border-slate-300"
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      <div className="space-y-6 pt-12 border-t border-slate-100">
        <div className="flex items-center justify-between text-slate-600">
          <div className="flex items-center gap-2">
            <HistoryIcon className="size-5" />
            <h2 className="text-xl font-medium">Recent Generations</h2>
          </div>
          <span className="text-sm text-slate-500 bg-slate-50 border border-slate-100 px-2.5 py-1 rounded-full font-medium">
            {generations.length} total
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {generations.map((gen) => (
            <div 
              key={gen._id} 
              className="group bg-white rounded-2xl border border-slate-100 p-5 hover:border-red-200 transition-all relative overflow-hidden flex flex-col justify-between"
            >
              <div className="flex flex-col h-full space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] text-slate-400 uppercase tracking-widest font-semibold">
                    {new Date(gen.createdAt).toLocaleString()}
                  </span>
                  <span className="text-xs text-red-500 bg-red-50 px-2 py-0.5 rounded-md font-medium">
                    {gen.tone}
                  </span>
                </div>
                
                <p className="text-sm text-slate-600 line-clamp-3 leading-relaxed flex-1">
                  {gen.content}
                </p>

                {gen.mediaUrl && (
                  <div className="rounded-xl overflow-hidden border border-slate-50 bg-slate-50">
                    <img 
                      src={gen.mediaUrl} 
                      alt="Generation Preview" 
                      className="w-full aspect-video object-cover opacity-90 group-hover:opacity-100 transition-opacity"
                    />
                  </div>
                )}

                <div className="flex items-center gap-2 pt-2">
                  <button 
                    type="button"
                    onClick={() => setActiveScheduler(gen)}
                    className="flex-1 bg-slate-100 hover:bg-red-500 hover:text-white text-slate-600 text-xs py-2.5 rounded-lg font-medium transition-all"
                  >
                    Schedule Post
                  </button>
                </div>
              </div>
            </div>
          ))}

          {generations.length === 0 && (
            <div className="col-span-full py-20 text-center space-y-2">
              <div className="size-12 bg-slate-50 rounded-2xl flex items-center justify-center mx-auto text-slate-300">
                <WandIcon className="size-6" />
              </div>
              <p className="text-sm text-slate-400 font-medium">
                No content generated yet. Click generate to get started!
              </p>
            </div>
          )}
        </div>
      </div>

      {activeScheduler && (
        <div className="fixed inset-0 min-h-screen z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-md animate-in fade-in duration-300">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl border border-slate-100 overflow-hidden flex flex-col max-h-[90vh]">
            <div className="flex items-center justify-between px-8 py-4 border-b border-slate-100 bg-slate-50/30">
              <h3 className="text-base font-medium text-slate-700">Schedule Generation</h3>
              <button 
                type="button"
                onClick={() => setActiveScheduler(null)}
                className="p-2 rounded-full hover:bg-slate-100 text-slate-400 transition-colors"
              >
                <XIcon className="size-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-8 space-y-4">
              <div className="bg-slate-50 rounded-2xl p-6 border border-slate-100 space-y-2">
                <span className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">Prompt</span>
                <p className="text-slate-800 text-sm leading-relaxed whitespace-pre-wrap">{activeScheduler.prompt}</p>
              </div>

              <div className="bg-slate-50 rounded-2xl p-6 border border-slate-100 space-y-4">
                <span className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">Generated Post</span>
                <p className="text-slate-800 text-sm leading-relaxed whitespace-pre-wrap">{activeScheduler.content}</p>
                {activeScheduler.mediaUrl && (
                  <img 
                    src={activeScheduler.mediaUrl} 
                    alt="preview"
                    className="w-full aspect-video object-cover rounded-xl border border-slate-200 shadow-sm"
                  />
                )}
              </div>
            </div>

            <div className="p-8 bg-slate-50/50 border-t border-slate-100 space-y-6">
              <div className="space-y-6">
                <div>
                  <label className="block text-xs text-slate-600 uppercase tracking-widest mb-3 font-medium">Select channels</label>
                  <div className="flex flex-wrap gap-2">
                    {PLATFORMS.map((p) => {
                      const active = selectedPlatforms.includes(p.id)
                      return (
                        <button
                          key={p.id}
                          type="button"
                          onClick={() =>
                            setSelectedPlatforms((prev) =>
                              prev.includes(p.id)
                                ? prev.filter((x) => x !== p.id)
                                : [...prev, p.id]
                            )
                          }
                          className={`p-2.5 rounded-md border text-xs transition-colors ${
                            active 
                              ? "bg-red-500 border-red-500 text-white"
                              : "bg-white border-slate-200 text-slate-400 hover:border-slate-300"
                          }`}
                        >
                          <p.icon className="size-4.5" />
                        </button>
                      )
                    })}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="relative">
                    <Calendar1Icon className="size-4 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                    <input 
                      type="date" 
                      className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-md text-slate-900 text-sm focus:outline-none transition-all"
                      onChange={(e) => setScheduledDate(e.target.value)} 
                      value={scheduledDate}
                    />
                  </div>

                  <div className="relative">
                    <Clock1Icon className="size-4 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                    <input 
                      type="time" 
                      className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-md text-slate-900 text-sm focus:outline-none transition-all"
                      onChange={(e) => setScheduledTime(e.target.value)} 
                      value={scheduledTime}
                    />
                  </div>
                </div>
              </div>

              <button 
                type="button"
                onClick={handleSchedule} 
                disabled={scheduling}
                className="w-full flex items-center justify-center gap-2 py-3 rounded-md bg-slate-900 text-white hover:bg-red-500 transition-colors font-medium text-sm"
              >
                {scheduling ? (
                  <>
                    <Loader2Icon className="size-4 animate-spin" />
                    <span>Scheduling...</span>
                  </>
                ) : (
                  <>
                    <TimerIcon className="size-4" />
                    <span>Schedule Post</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default AIComposer