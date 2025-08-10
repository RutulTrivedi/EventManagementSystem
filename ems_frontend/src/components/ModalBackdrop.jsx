// ModalBackdrop.jsx
const ModalBackdrop = ({ children }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white p-8 rounded shadow-md relative w-full max-w-md">
        {children}
      </div>
    </div>
  );
};

export default ModalBackdrop;
