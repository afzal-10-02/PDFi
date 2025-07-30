import React, { useState, useRef, useEffect } from "react";
import { jsPDF } from "jspdf";
import Sortable from "sortablejs";

function JPGtoPDFConverter() {
  const [imageFiles, setImageFiles] = useState([]);
  const previewRef = useRef();
  const fileInputRef = useRef(null);
  const sortableRef = useRef(null);

  useEffect(() => {
    if (previewRef.current && !sortableRef.current) {
      sortableRef.current = Sortable.create(previewRef.current, {
        animation: 150,
        onEnd: function (evt) {
          setImageFiles((prevFiles) => {
            const newOrder = [...prevFiles];
            const [movedItem] = newOrder.splice(evt.oldIndex, 1);
            newOrder.splice(evt.newIndex, 0, movedItem);
            return newOrder;
          });
        },
      });
    }
  }, []);

  const handleFileChange = (event) => {
    const files = Array.from(event.target.files);
    setImageFiles((prev) => [...prev, ...files]);
  };

  const handleRemoveImage = (indexToRemove) => {
    setImageFiles((prev) => prev.filter((_, index) => index !== indexToRemove));
  };

  const readFileAsDataURL = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  const loadImage = (dataURL) => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => resolve(img);
      img.onerror = reject;
      img.src = dataURL;
    });
  };

  const convertToPDF = async () => {
    if (imageFiles.length === 0) {
      alert("Please select JPG files first.");
      return;
    }

    const fixedWidth = 794;
    let pdf = null;

    for (let i = 0; i < imageFiles.length; i++) {
      const file = imageFiles[i];
      const dataURL = await readFileAsDataURL(file);
      const img = await loadImage(dataURL);

      const aspectRatio = img.height / img.width;
      const resizedHeight = fixedWidth * aspectRatio;
      const orientation = fixedWidth > resizedHeight ? "landscape" : "portrait";

      if (i === 0) {
        pdf = new jsPDF({
          orientation,
          unit: "px",
          format: [fixedWidth, resizedHeight],
        });
      } else {
        pdf.addPage([fixedWidth, resizedHeight], orientation);
      }

      pdf.addImage(dataURL, "JPEG", 0, 0, fixedWidth, resizedHeight);
    }

    const baseName = imageFiles[0].name.replace(/\.[^/.]+$/, "");
    const shortName = baseName.slice(0, 8);
    const filename = shortName + ".pdf";
    pdf.save(filename);
  };

  return (
    <div className="container py-4 min-vh-100 d-flex flex-column justify-content-between">

  {/* Hidden File Input */}
  <input
    type="file"
    multiple
    accept="image/jpeg"
    onChange={handleFileChange}
    ref={fileInputRef}
    style={{ display: "none" }}
  />

  {/* Choose/Add Images Button */}
  <div className="text-center mb-4">
    <button
      className="btn btn-primary"
      onClick={() => fileInputRef.current.click()}
    >
      {imageFiles.length === 0 ? "Choose Images" : "Add More Images"}
    </button>
  </div>

  {/* Image Preview Section */}
 <div
  ref={previewRef}
  className="row g-3 justify-content-center border border-secondary rounded bg-white"
  style={{ minHeight: "200px" }}
>
  {imageFiles.map((file, index) => {
    const url = URL.createObjectURL(file);
    return (
      <div
        key={file.name + index}
        className="col-12 col-md-4"
      >
        {/* Wrapper to position the cut button relative to the image */}
        <div className="position-relative">
          <img
            src={url}
            alt="preview"
            className="img-fluid rounded border"
            style={{
              maxHeight: "90vh",
              width: "100%",
              objectFit: "contain",
            }}
          />

          {/* Remove Button - Now positioned correctly */}
          <button
            onClick={() => handleRemoveImage(index)}
            className="btn btn-danger btn-sm position-absolute"
            style={{
              top: "8px",
              right: "8px",
              borderRadius: "50%",
              width: "24px",
              height: "24px",
              fontSize: "18px",
              padding: 0,
              lineHeight: "20px",
            }}
          >
            ×
          </button>
        </div>

        {/* Image name below the image */}
        <div className="text-center small mt-2 text-truncate">
          {file.name}
        </div>
      </div>
    );
  })}
</div>


  {/* Download Button */}
  <div className="text-center mt-4">
    <button
      className="btn btn-danger px-4 py-2"
      onClick={convertToPDF}
      disabled={imageFiles.length === 0}
    >
      Download PDF
    </button>
  </div>
</div>


  );
}

export default JPGtoPDFConverter;
