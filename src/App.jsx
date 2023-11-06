import ImageGallery from "./ImageGallery";
import "./App.css";
import { ToastContainer } from "react-toastify";

function App() {
    return (
        <>
            <ImageGallery />
            <ToastContainer 
            position="top-center"
            />
        </>
    );
}

export default App;
