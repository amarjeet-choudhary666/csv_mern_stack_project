"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function UploadPage() {
  const [file, setFile] = useState<File | null>(null);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [inputKey, setInputKey] = useState(Date.now());

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!file) {
      setMessage("Please select a CSV file.");
      return;
    }

    const formData = new FormData();
    formData.append("csvFile", file);
    setLoading(true);
    setMessage("");

    try {
      const res = await fetch("http://localhost:4000/api/v1/tasks/upload", {
        method: "POST",
        body: formData,
      });

      let data;
      try {
        data = await res.json();
      } catch {
        data = {};
      }

      if (res.ok) {
        setMessage("Upload successful and lists distributed!");
        setFile(null);
        setInputKey(Date.now());
      } else {
        setMessage(data.message || "Something went wrong.");
      }
    } catch (error) {
      console.error(error);
      setMessage("Upload failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-20 p-4 border rounded-lg shadow">
      <h1 className="text-xl font-semibold mb-4">Upload CSV File</h1>

      <Input key={inputKey} type="file" accept=".csv" onChange={handleFileChange} />
      <Button className="mt-4 w-full" onClick={handleUpload} disabled={loading}>
        {loading ? "Uploading..." : "Upload"}
      </Button>

      {message && <p className="mt-4 text-center text-sm text-gray-700">{message}</p>}
    </div>
  );
}
