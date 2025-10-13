// src/components/SubmitLoader.jsx

export default function SubmitLoader({ show = false }) {
  if (!show) return null;

  return (
    <div className="submit-loader-overlay bg-gray-50">
      <div className="submit-loader-modal">
        <div className="spinner">
          <div></div>
          <div></div>
          <div></div>
          <div></div>
          <div></div>
          <div></div>
        </div>
      </div>
    </div>
  );
}
