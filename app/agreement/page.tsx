"use client";
import { useRef, useState } from "react";
import dynamic from "next/dynamic";
import jsPDF from "jspdf";
import Header from '@/components/Header';

const SignaturePad = dynamic(() => import("react-signature-canvas") as any, { ssr: false }) as any;

export default function AgreementPage() {
  const [form, setForm] = useState({
    landlordName: "",
    landlordEmail: "",
    landlordPhone: "",
    tenantName: "",
    tenantEmail: "",
    tenantPhone: "",
    propertyAddress: "",
    deposit: "",
    startDate: "",
    endDate: "",
  });
  const landlordSigRef = useRef<any>(null);
  const tenantSigRef = useRef<any>(null);
  const [error, setError] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
  };

  const clearSignature = (who: "landlord" | "tenant") => {
    if (who === "landlord") landlordSigRef.current?.clear();
    if (who === "tenant") tenantSigRef.current?.clear();
  };

  const handleDownload = () => {
    if (!form.landlordName || !form.tenantName || !form.propertyAddress) {
      setError("Please fill all required fields.");
      return;
    }
    setError("");
    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.text("Security Deposit Agreement", 15, 20);
    doc.setFontSize(12);
    doc.text(`This agreement is made between ${form.landlordName} (Landlord) and ${form.tenantName} (Tenant) for the property at ${form.propertyAddress}.`, 15, 35, { maxWidth: 180 });
    doc.text(`Security Deposit: ₹${form.deposit || "-"}, Start Date: ${form.startDate || "-"}, End Date: ${form.endDate || "-"}`, 15, 50, { maxWidth: 180 });
    doc.text("Landlord Details:", 15, 65);
    doc.text(`Name: ${form.landlordName}\nEmail: ${form.landlordEmail}\nPhone: ${form.landlordPhone}`, 15, 72);
    doc.text("Tenant Details:", 110, 65);
    doc.text(`Name: ${form.tenantName}\nEmail: ${form.tenantEmail}\nPhone: ${form.tenantPhone}`, 110, 72);
    doc.text("Agreement Terms:", 15, 95);
    doc.text(
      [
        "1. The landlord holds the security deposit as per the agreement.",
        "2. The tenant agrees to the terms and conditions.",
        "3. The deposit will be returned as per the agreement after deductions, if any.",
        "4. Both parties agree to sign this document electronically.",
      ].join("\n"),
      15,
      102
    );
    // Signatures
    doc.text("Landlord Signature:", 15, 140);
    const landlordSig = landlordSigRef.current?.isEmpty() ? null : landlordSigRef.current?.getTrimmedCanvas().toDataURL("image/png");
    if (landlordSig) doc.addImage(landlordSig, "PNG", 15, 145, 60, 20);
    doc.text("Tenant Signature:", 110, 140);
    const tenantSig = tenantSigRef.current?.isEmpty() ? null : tenantSigRef.current?.getTrimmedCanvas().toDataURL("image/png");
    if (tenantSig) doc.addImage(tenantSig, "PNG", 110, 145, 60, 20);
    doc.save("Security-Deposit-Agreement.pdf");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-blue-100">
      <Header />
      <div className="max-w-3xl mx-auto p-4 md:p-8">
        {/* Workflow Section */}
        <div className="max-w-2xl mx-auto my-8 flex flex-col md:flex-row items-center justify-center gap-4">
          {/* Step 1 */}
          <div className="flex-1 bg-indigo-100 border border-indigo-200 rounded-xl shadow-md p-6 flex flex-col items-center text-center min-w-[220px]">
            <div className="text-3xl mb-2">📝</div>
            <div className="font-bold text-indigo-700 mb-2">Landlord fills the agreement</div>
            <ul className="list-disc pl-4 text-left text-sm text-gray-700">
              <li>Enters details, property, deposit</li>
              <li>Signs electronically</li>
              <li>Submits the agreement</li>
            </ul>
          </div>
          {/* Arrow */}
          <div className="hidden md:flex items-center">
            <svg width="40" height="40" fill="none" viewBox="0 0 40 40">
              <path d="M10 20h20M25 15l5 5-5 5" stroke="#6366F1" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          {/* Step 2 */}
          <div className="flex-1 bg-indigo-100 border border-indigo-200 rounded-xl shadow-md p-6 flex flex-col items-center text-center min-w-[220px]">
            <div className="text-3xl mb-2">📧</div>
            <div className="font-bold text-indigo-700 mb-2">Tenant receives an email and fills the agreement</div>
            <ul className="list-disc pl-4 text-left text-sm text-gray-700">
              <li>Gets a unique link</li>
              <li>Fills their details, signs electronically</li>
              <li>Submits the agreement</li>
            </ul>
          </div>
          {/* Arrow */}
          <div className="hidden md:flex items-center">
            <svg width="40" height="40" fill="none" viewBox="0 0 40 40">
              <path d="M10 20h20M25 15l5 5-5 5" stroke="#6366F1" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          {/* Step 3: GharConnect Director signs */}
          <div className="flex-1 bg-indigo-100 border border-indigo-200 rounded-xl shadow-md p-6 flex flex-col items-center text-center min-w-[220px]">
            <div className="text-3xl mb-2">✍️</div>
            <div className="font-bold text-indigo-700 mb-2">GharConnect receives the email and a Director signs</div>
            <ul className="list-disc pl-4 text-left text-sm text-gray-700">
              <li>Director reviews the agreement</li>
              <li>Signs electronically</li>
              <li>Submits the agreement</li>
            </ul>
          </div>
          {/* Arrow */}
          <div className="hidden md:flex items-center">
            <svg width="40" height="40" fill="none" viewBox="0 0 40 40">
              <path d="M10 20h20M25 15l5 5-5 5" stroke="#6366F1" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          {/* Step 4: Final sharing */}
          <div className="flex-1 bg-indigo-100 border border-indigo-200 rounded-xl shadow-md p-6 flex flex-col items-center text-center min-w-[220px]">
            <div className="text-3xl mb-2">✅</div>
            <div className="font-bold text-indigo-700 mb-2">Final agreement is shared</div>
            <ul className="list-disc pl-4 text-left text-sm text-gray-700">
              <li>Completed, signed agreement sent to all parties</li>
              <li>Everyone gets a copy</li>
            </ul>
          </div>
        </div>
        {/* Divider */}
        <div className="my-8 border-t border-indigo-200" />
        {/* Main Card */}
        <div className="bg-white rounded-2xl shadow-xl p-6 md:p-10">
          <h1 className="text-2xl font-bold mb-6 text-center text-indigo-700">Security Deposit Agreement</h1>
          <form className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
            <div>
              <h2 className="font-semibold mb-2 text-indigo-700">Landlord Details</h2>
              <input name="landlordName" value={form.landlordName} onChange={handleChange} placeholder="Name" className="mb-3 w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-400 focus:outline-none" required />
              <input name="landlordEmail" value={form.landlordEmail} onChange={handleChange} placeholder="Email" className="mb-3 w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-400 focus:outline-none" />
              <input name="landlordPhone" value={form.landlordPhone} onChange={handleChange} placeholder="Phone" className="mb-3 w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-400 focus:outline-none" />
            </div>
            <div>
              <h2 className="font-semibold mb-2 text-indigo-700">Tenant Details</h2>
              <input name="tenantName" value={form.tenantName} onChange={handleChange} placeholder="Name" className="mb-3 w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-400 focus:outline-none" required />
              <input name="tenantEmail" value={form.tenantEmail} onChange={handleChange} placeholder="Email" className="mb-3 w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-400 focus:outline-none" />
              <input name="tenantPhone" value={form.tenantPhone} onChange={handleChange} placeholder="Phone" className="mb-3 w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-400 focus:outline-none" />
            </div>
            <div className="md:col-span-2">
              <h2 className="font-semibold mb-2 text-indigo-700">Property & Agreement</h2>
              <input name="propertyAddress" value={form.propertyAddress} onChange={handleChange} placeholder="Property Address" className="mb-3 w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-400 focus:outline-none" required />
              <input name="deposit" value={form.deposit} onChange={handleChange} placeholder="Security Deposit (₹)" className="mb-3 w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-400 focus:outline-none" />
              <div className="flex gap-2">
                <input name="startDate" value={form.startDate} onChange={handleChange} placeholder="Start Date" type="date" className="mb-3 w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-400 focus:outline-none" />
                <input name="endDate" value={form.endDate} onChange={handleChange} placeholder="End Date" type="date" className="mb-3 w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-400 focus:outline-none" />
              </div>
            </div>
          </form>
          {/* Agreement Preview */}
          <div className="border-2 border-dashed border-indigo-200 rounded-xl p-6 mb-10 bg-indigo-50 shadow-inner">
            <h2 className="font-bold mb-2 text-indigo-700 text-center">Agreement Preview</h2>
            <p className="mb-2">This agreement is made between <b>{form.landlordName || 'Landlord'}</b> and <b>{form.tenantName || 'Tenant'}</b> for the property at <b>{form.propertyAddress || 'Property Address'}</b>.</p>
            <p className="mb-2">Security Deposit: <b>₹{form.deposit || '-'}</b></p>
            <p className="mb-2">Start Date: <b>{form.startDate || '-'}</b> | End Date: <b>{form.endDate || '-'}</b></p>
            <p className="mb-2">Landlord Details: {form.landlordName} {form.landlordEmail && `| ${form.landlordEmail}`} {form.landlordPhone && `| ${form.landlordPhone}`}</p>
            <p className="mb-2">Tenant Details: {form.tenantName} {form.tenantEmail && `| ${form.tenantEmail}`} {form.tenantPhone && `| ${form.tenantPhone}`}</p>
            <ul className="list-disc pl-6 mt-2 text-sm text-gray-700">
              <li>The landlord holds the security deposit as per the agreement.</li>
              <li>The tenant agrees to the terms and conditions.</li>
              <li>The deposit will be returned as per the agreement after deductions, if any.</li>
              <li>Both parties agree to sign this document electronically.</li>
            </ul>
          </div>
          {/* Signature Pads */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
            <div className="bg-gray-50 rounded-xl p-4 shadow-inner flex flex-col items-center">
              <label className="font-semibold text-indigo-700 mb-2">Landlord Signature:</label>
              <SignaturePad ref={landlordSigRef} canvasProps={{ width: 300, height: 100, className: "border rounded bg-white shadow" }} />
              <button type="button" className="text-xs text-blue-600 mt-1" onClick={() => clearSignature("landlord")}>Clear</button>
            </div>
            <div className="bg-gray-50 rounded-xl p-4 shadow-inner flex flex-col items-center">
              <label className="font-semibold text-indigo-700 mb-2">Tenant Signature:</label>
              <SignaturePad ref={tenantSigRef} canvasProps={{ width: 300, height: 100, className: "border rounded bg-white shadow" }} />
              <button type="button" className="text-xs text-blue-600 mt-1" onClick={() => clearSignature("tenant")}>Clear</button>
            </div>
          </div>
          {error && <div className="text-red-600 mb-4 text-center">{error}</div>}
          <div className="flex justify-center">
            <button type="button" className="px-8 py-3 bg-indigo-600 text-white rounded-lg font-semibold shadow hover:bg-indigo-700 transition" onClick={handleDownload}>
              Download PDF
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
