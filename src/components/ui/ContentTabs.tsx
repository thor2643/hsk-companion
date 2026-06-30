export type ContentTabId = "vocabulary" | "sentences" | "grammar";

type ContentTab = {
  id: ContentTabId;
  label: string;
};

const tabs: ContentTab[] = [
  { id: "vocabulary", label: "Vocabulary" },
  { id: "sentences", label: "Sentences" },
  { id: "grammar", label: "Grammar" },
];

type ContentTabsProps = {
  activeTab: ContentTabId;
  onChange: (tab: ContentTabId) => void;
};

export function ContentTabs({ activeTab, onChange }: ContentTabsProps) {
  return (
    <div className="grid grid-cols-3 rounded-lg bg-stone-100 p-1">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          type="button"
          className={`rounded-md px-3 py-2 text-sm font-medium transition ${
            activeTab === tab.id
              ? "bg-white text-slate-950 shadow-sm"
              : "text-slate-600 hover:text-slate-950"
          }`}
          onClick={() => onChange(tab.id)}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}
