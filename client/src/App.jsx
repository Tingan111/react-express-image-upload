  import { useState } from "react";
  import "./App.css";

  function App() {
    const [file, setFile] = useState(null);
    const [previewUrl, setPreviewUrl] = useState(null);
    const [message, setMessage] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [upLoadedImageUrl, setUploadedImageUrl] = useState("");
    const handleFileChange = (event) => {
      const selectedFile = event.target.files[0];
      if (selectedFile) {
        setFile(selectedFile);
        setPreviewUrl(URL.createObjectURL(selectedFile));
        setMessage("");
      } else {
        setFile(null);
        setPreviewUrl(null);
      }
    };
    const handleSubmit = async (event) => {
      event.preventDefault();
      if (!file) {
        setMessage("請先選擇圖片！");
        return;
      }
      setIsLoading(true);
      setMessage("上傳中");
      setUploadedImageUrl("");
      const formData=new FormData();
      formData.append("image", file);
      try {
        const response = await fetch("http://localhost:5001/api/upload", {
          method: "POST",
          body: formData,
        });

        const data = await response.json();

        if (response.ok) {
          setMessage(`Upload successful!`);
          setUploadedImageUrl(data.imageUrl);
          console.log("Server response", data);
        } else {
          setMessage(`Upload failed: ${data.message || "Unknown error"}`);
        }
      } catch (error) {
        console.error("Upload error", error);
        setMessage(`Upload failed:${data.message || "Unknown error"}`);
      } finally {
        setIsLoading(false);
      }
    };

    return (
      <div className="App">
        <header>
          <h1>image</h1>
          <form onSubmit={handleSubmit}>
            <input type="file" onChange={handleFileChange} accept="image/*" />
            <button type="submit" disabled={!file || isLoading}>
              {isLoading ? "Uploading" : "Upload Image"}
            </button>
          </form>
          {previewUrl && (
            <div style={{ marginTop: "20px" }}>
              <h3>Preview:</h3>
              <img
                src={previewUrl}
                alt="Preview"
                style={{ maxWidth: "300px", maxHeight: "300px" }}
              />
            </div>
          )}
          {upLoadedImageUrl&&(
            <div style={{ marginTop: "20px" }}>
            <h3>Preview:</h3>
            <img
              src={upLoadedImageUrl}
              alt="Upload"
              style={{ maxWidth: "300px", maxHeight: "300px" }}
            />
          </div>
          )}
          {message &&(<p style={{marginTop:'20px'}}>{message}</p>)}
        </header>
      </div>
    );
  }

  export default App;
