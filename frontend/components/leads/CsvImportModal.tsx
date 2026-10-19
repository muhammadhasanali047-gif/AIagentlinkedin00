import React, { useState } from "react";
import {
  FileSpreadsheet,
  AlertTriangle,
  CheckCircle2,
  Upload,
  Info,
} from "lucide-react";
import { Modal } from "../ui/Modal";
import { Lead } from "../../types";
import { useDemoData } from "../../context/DemoDataContext";

interface CsvImportModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const SAMPLE_CSV = `Name,Title,Company,CompanySize,Industry,Location,LinkedInURL
Jordan Lee,VP of Technology,Nexus FinScale,51-200 employees,Fintech,Austin TX,https://linkedin.com/in/jordan-lee-tech
Samantha Ray,Head of Engineering,Acuity Robotics,11-50 employees,AI & Robotics,Boston MA,https://linkedin.com/in/samantha-ray-robotics
Sarah Jenkins,VP of Engineering,CloudScale Systems,51-200 employees,Cloud Software,Austin TX,https://linkedin.com/in/sarah-jenkins-cloudscale
Tyler Brooks,Junior Intern,Random Design,1-10 employees,Design,Remote,https://linkedin.com/in/tyler-brooks-intern`;

export function CsvImportModal({ isOpen, onClose }: CsvImportModalProps) {
  const { importCsvLeads } = useDemoData();
  const [csvContent, setCsvContent] = useState("");
  const [importResult, setImportResult] = useState<{ added: number; duplicates: number } | null>(
    null
  );

  const handleLoadSample = () => {
    setCsvContent(SAMPLE_CSV);
    setImportResult(null);
  };

  const parseCsv = (text: string): Partial<Lead>[] => {
    const lines = text
      .split("\n")
      .map((l) => l.trim())
      .filter(Boolean);
    if (lines.length <= 1) return [];

    const headers = lines[0].split(",").map((h) => h.trim().toLowerCase());

    const leads: Partial<Lead>[] = [];

    for (let i = 1; i < lines.length; i++) {
      const parts = lines[i].split(",").map((p) => p.trim());
      if (parts.length >= 3) {
        leads.push({
          name: parts[0] || "Unknown",
          title: parts[1] || "Executive",
          company: parts[2] || "Company",
          companySize: parts[3] || "51-200 employees",
          industry: parts[4] || "SaaS",
          location: parts[5] || "United States",
          linkedinUrl: parts[6] || `https://linkedin.com/in/lead-${Date.now()}-${i}`,
          aiScore: 78,
          aiScoreExplanation: "Imported via CSV. Ready for Gemini ICP qualification.",
        });
      }
    }

    return leads;
  };

  const handleImport = () => {
    const parsed = parseCsv(csvContent);
    if (parsed.length === 0) {
      alert("Please enter valid CSV data with at least 1 lead row.");
      return;
    }

    const result = importCsvLeads(parsed);
    setImportResult(result);
  };

  const handleReset = () => {
    setCsvContent("");
    setImportResult(null);
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleReset}
      title="Import Leads via CSV"
      description="Upload or paste lead lists. Duplicate LinkedIn profiles and suppressed domains will be detected automatically."
      maxWidth="xl"
      footer={
        importResult ? (
          <button
            onClick={handleReset}
            className="px-4 py-2 bg-slate-900 text-white rounded-lg text-xs font-semibold hover:bg-slate-800 transition-colors"
          >
            Close &amp; View Pipeline
          </button>
        ) : (
          <div className="flex items-center justify-between w-full">
            <button
              onClick={handleLoadSample}
              className="text-xs text-sky-600 hover:text-sky-700 font-semibold"
            >
              Load Sample B2B Leads
            </button>
            <div className="flex items-center gap-2">
              <button
                onClick={handleReset}
                className="px-3 py-1.5 text-xs font-semibold text-slate-600 hover:bg-slate-200 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleImport}
                disabled={!csvContent.trim()}
                className="px-4 py-2 bg-sky-600 hover:bg-sky-700 text-white text-xs font-semibold rounded-lg shadow-xs transition-colors disabled:opacity-50"
              >
                Parse &amp; Import
              </button>
            </div>
          </div>
        )
      }
    >
      <div className="space-y-4">
        {importResult ? (
          <div className="p-6 bg-slate-50 border border-slate-200 rounded-xl text-center space-y-3">
            <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <h4 className="text-base font-bold text-slate-900">Import Batch Finished</h4>
            <div className="grid grid-cols-2 gap-3 max-w-xs mx-auto text-xs pt-2">
              <div className="p-3 bg-white rounded-lg border border-slate-200">
                <span className="block text-slate-500">New Leads Added</span>
                <span className="text-lg font-bold text-emerald-600">+{importResult.added}</span>
              </div>
              <div className="p-3 bg-white rounded-lg border border-slate-200">
                <span className="block text-slate-500">Duplicates Skipped</span>
                <span className="text-lg font-bold text-amber-600">{importResult.duplicates}</span>
              </div>
            </div>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              Duplicate LinkedIn URLs were safely de-duplicated to prevent double messaging per outreach safety guidelines.
            </p>
          </div>
        ) : (
          <>
            <div className="p-3 bg-sky-50 border border-sky-100 rounded-xl text-xs text-sky-900 flex items-start gap-2.5">
              <Info className="w-4 h-4 text-sky-600 shrink-0 mt-0.5" />
              <div>
                <span className="font-semibold">Format Specification:</span> Expected headers:{" "}
                <code className="bg-sky-100/70 px-1 py-0.5 rounded text-[11px] font-mono">
                  Name, Title, Company, CompanySize, Industry, Location, LinkedInURL
                </code>
              </div>
            </div>

            {/* File Upload Dropzone / Picker */}
            <div className="border-2 border-dashed border-slate-300 hover:border-sky-500 rounded-xl p-4 text-center bg-slate-50 transition-colors">
              <input
                type="file"
                id="csvFileInput"
                accept=".csv,text/csv"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    const reader = new FileReader();
                    reader.onload = (event) => {
                      setCsvContent((event.target?.result as string) || "");
                    };
                    reader.readAsText(file);
                  }
                }}
                className="hidden"
              />
              <label htmlFor="csvFileInput" className="cursor-pointer flex flex-col items-center gap-1.5">
                <Upload className="w-5 h-5 text-sky-600" />
                <span className="text-xs font-semibold text-slate-800">
                  Click to browse your .CSV file
                </span>
                <span className="text-[11px] text-slate-400">
                  Supports files exported from Apollo.io, Sales Navigator, or Excel
                </span>
              </label>
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-slate-700">Or Paste CSV Contents</label>
                {csvContent && (
                  <span className="text-[11px] text-emerald-600 font-semibold">
                    ✓ File Content Loaded ({csvContent.split("\n").filter(Boolean).length - 1} rows)
                  </span>
                )}
              </div>
              <textarea
                rows={6}
                value={csvContent}
                onChange={(e) => setCsvContent(e.target.value)}
                placeholder="Paste CSV rows here or click 'Click to browse your .CSV file' above..."
                className="w-full text-xs font-mono p-3 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-sky-500 bg-slate-50 focus:bg-white text-slate-800 leading-normal"
              />
            </div>
          </>
        )}
      </div>
    </Modal>
  );
}
