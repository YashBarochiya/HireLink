import React, { useState } from "react";

const Messages = ({ messages }) => {
  const [visibleMessages, setVisibleMessages] = useState(messages);

  // Remove message when the close button is clicked
  const handleClose = (index) => {
    setVisibleMessages(visibleMessages.filter((_, i) => i !== index));
  };

  return (
    <>
      {visibleMessages.length > 0 &&
        visibleMessages.map((message, index) => (
          <div
            key={index}
            className={`mb-5 alert alert-${message.type} alert-dismissible`}
            role="alert"
          >
            <button
              type="button"
              className="close"
              onClick={() => handleClose(index)}
              aria-label="Close"
            >
              <span aria-hidden="true">&times;</span>
            </button>
            {message.text}
          </div>
        ))}
    </>
  );
};

export default Messages;
