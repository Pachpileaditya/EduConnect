import React from "react";

const isPdf = (url) => {
  if (!url) return false;
  // Check for .pdf extension or common Cloudinary PDF pattern
  return url.toLowerCase().endsWith('.pdf') || url.includes('/upload/') && url.includes('.pdf');
};

const ViewContent = ({ unit }) => {
  if (!unit) return <p>No unit details available.</p>;

  const url = unit.url || unit.fileURL;

  return (
    <div className="container mt-4">
      <div className="card shadow-sm p-4">
        <h4 className="text-primary">Unit: {unit.unitNumber || unit.id}</h4>
        <hr />
        <p>
          <strong>Title:</strong> {unit.title || "No Title"}
        </p>
        <p>
          <strong>Description:</strong> {unit.description || "No Description Available"}
        </p>
        {url ? (
          <div style={{ marginTop: 16 }}>
            {isPdf(url) ? (
              <a
                href={url}
                download
                className="btn btn-success"
              >
                Download PDF
              </a>
            ) : (
              <a
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-primary"
              >
                View Link
              </a>
            )}
          </div>
        ) : (
          <p>No file or link available.</p>
        )}
      </div>
    </div>
  );
};

export default ViewContent;
