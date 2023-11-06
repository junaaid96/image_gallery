import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const userImageHostingKey = import.meta.env.VITE_REACT_APP_imgbb_api;

const notifyError = () => toast.error("No Image Selected!");
const notifySuccess = () => toast.success("Image Deleted!");

const UploadImage = (data) => {
    const formData = new FormData();
    formData.append("image", data.photo);
    const url = `https://api.imgbb.com/1/upload?key=${userImageHostingKey}`;

    return fetch(url, {
        method: "POST",
        body: formData,
    })
        .then((response) => response.json())
        .then((result) => {
            console.log(result);
            return result.data.url;
        })
        .catch((error) => {
            console.error(error);
            throw error;
        });
};

const ImageGallery = () => {
    const [imageURLs, setImageURLs] = useState([]);
    const [selectedImages, setSelectedImages] = useState([]); // Store selected image indexes

    // Load image URLs from local storage when the component mounts
    useEffect(() => {
        const storedImageURLs = JSON.parse(
            localStorage.getItem("uploadedImageURLs") || "[]"
        );
        setImageURLs(storedImageURLs);
    }, []);

    const handleFileChange = (event) => {
        const file = event.target.files[0];

        if (file) {
            UploadImage({ photo: file })
                .then((url) => {
                    const newImageURLs = [...imageURLs, url];
                    setImageURLs(newImageURLs);

                    // Store the updated image URLs in local storage
                    localStorage.setItem(
                        "uploadedImageURLs",
                        JSON.stringify(newImageURLs)
                    );
                })
                .catch((error) => console.error(error));
        }
    };

    const handleDeleteClick = () => {
        // Delete the selected images and update the state
        const newImageURLs = imageURLs.filter(
            (_, index) => !selectedImages.includes(index)
        );
        setImageURLs(newImageURLs);

        // Clear selected images
        setSelectedImages([]);

        // Update the stored image URLs in local storage
        localStorage.setItem("uploadedImageURLs", JSON.stringify(newImageURLs));

        //Show success msg
        notifySuccess();
    };

    const handleImageSelect = (index) => {
        // Toggle selection of the clicked image
        const isSelected = selectedImages.includes(index);
        if (isSelected) {
            setSelectedImages(selectedImages.filter((i) => i !== index));
        } else {
            setSelectedImages([...selectedImages, index]);
        }
    };

    return (
        <>
            <h1 className="font-semibold">Public Image Gallery</h1>
            <p className="mb-20 mt-2 font-medium">
                All images will upload to{" "}
                <a href="https://md-junaidul.imgbb.com/" target="blank">
                    imgBB
                </a>{" "}
                and will store the imgURL in your localStorage temporary.
            </p>
            <div className="flex justify-between items-center mb-20">
                <p className="font-medium">{selectedImages.length} Selected</p>
                <button
                    onClick={
                        selectedImages.length != 0
                            ? handleDeleteClick
                            : notifyError
                    }
                    className=" bg-red-700 text-white h-fit w-fit relative"
                >
                    Delete
                </button>
            </div>
            <div className="flex flex-wrap justify-center items-center">
                {imageURLs.length > 0 ? (
                    <>
                        {imageURLs.map((url, index) => (
                            <div key={index}>
                                <input
                                    type="checkbox"
                                    checked={selectedImages.includes(index)}
                                    onChange={() => handleImageSelect(index)}
                                    className="relative top-8 left-36 accent-red-700"
                                />
                                <img
                                    src={url}
                                    alt={`Uploaded image ${index + 1}`}
                                    className="max-w-xs max-h-xs m-2"
                                />
                            </div>
                        ))}
                    </>
                ) : (
                    <p className="text-yellow-400">
                        No images uploaded. Try upload some.
                    </p>
                )}
            </div>
            <div className="mt-10">
                <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="border"
                />
            </div>
        </>
    );
};

export default ImageGallery;
