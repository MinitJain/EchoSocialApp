import { CopilotChat } from "@copilotkit/react-ui";
import { RiCloseLine } from "react-icons/ri";
import "@copilotkit/react-ui/styles.css";

const CopilotHelper = ({ open, setOpen }) => {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center">
      {/* Background */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={() => setOpen(false)}
      />

      {/* Bottom Sheet */}
      <div
        className="
        relative z-50
        w-full md:w-[420px]
        h-[85vh] md:h-[600px]
        bg-white dark:bg-zinc-950
        rounded-t-3xl md:rounded-2xl
        shadow-2xl
        border border-zinc-200 dark:border-zinc-800
        flex flex-col
        animate-slideUp
        "
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-zinc-200 dark:border-zinc-800">
          <h2 className="font-semibold text-lg text-zinc-900 dark:text-zinc-100">
            Echo AI
          </h2>

          <button
            onClick={() => setOpen(false)}
            className="p-2 rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-800 transition"
          >
            <RiCloseLine size={22} />
          </button>
        </div>

        {/* Chat */}
        <div className="flex-1 overflow-hidden">
          <CopilotChat
            instructions="You are Echo AI. Help users write engaging tweets, threads, hashtags and improve content. Keep responses concise and helpful."
            appearance={{
              background: "bg-transparent",
              textColor: "text-zinc-900 dark:text-zinc-100",
              border: "border-none",
              shadow: "shadow-none",
              radius: "rounded-none",
            }}
            hitEnterToSubmit
            showThinkingIndicator
          />
        </div>
      </div>
    </div>
  );
};

export default CopilotHelper;
