import Modal from "react-modal";

interface ModalProps {
  isOpen: boolean;
  onRequestClose: () => void;
  children: React.ReactNode;
}

const StyledModal: ReactModal.Styles = {
  overlay: {
    backgroundColor: " rgba(0, 0, 0, 0.4)",
    width: "100%",
    height: "100vh",
    zIndex: "10",
    position: "fixed",
    top: "0",
    left: "0",
  },
  content: {
    width: "360px",
    //height: "",
    zIndex: "150",
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    borderRadius: "10px",
    boxShadow: "2px 2px 2px rgba(0, 0, 0, 0.25)",
    backgroundColor: "white",
    justifyContent: "center",
    overflow: "auto",
    //overflow: "visible",
    maxHeight: "80vh", // 최대 높이 설정 (스크롤을 위해)
  },
};

export default function BasicModal({
  isOpen,
  onRequestClose,
  children,
}: ModalProps) {
  return (
    <Modal isOpen={isOpen} onRequestClose={onRequestClose} style={StyledModal}>
      <div className="flex flex-col">{children}</div>
    </Modal>
  );
}
