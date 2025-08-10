import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

const Sidebar = ({ onOpenChat }) => {
  // State to handle dropdown visibility
  const [showVision, setShowVision] = useState(false);
  const [showMission, setShowMission] = useState(false);

  return (
    <div className="d-flex flex-column p-3 bg-light vh-100" style={{ width: '250px' }}>
      <h4 className="text-primary">Sidebar</h4>
      <hr />

      {/* Vision Dropdown */}
      <div>
        <button className="btn btn-outline-primary w-100 text-start" onClick={() => setShowVision(!showVision)}>
          Vision {showVision ? '▲' : '▼'}
        </button>
        {showVision && (
          <p className="mt-2 text-muted">
            Our vision is to create a platform that enhances learning by integrating modern technology with traditional education, enabling students to acquire knowledge in a seamless and interactive way.
          </p>
        )}
      </div>

      {/* Mission Dropdown */}
      <div className="mt-3">
        <button className="btn btn-outline-primary w-100 text-start" onClick={() => setShowMission(!showMission)}>
          Mission {showMission ? '▲' : '▼'}
        </button>
        {showMission && (
          <p className="mt-2 text-muted">
            Our mission is to provide students with high-quality educational resources, fostering creativity and critical thinking. We strive to bridge the gap between learners and educators through innovative solutions.
          </p>
        )}
      </div>
      <button className="btn btn-info w-100 mt-3" onClick={onOpenChat}>
        💬 Chat App
      </button>
    </div>
  );
};

export default Sidebar;
