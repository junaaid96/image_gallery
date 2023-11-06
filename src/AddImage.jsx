import { useState, useEffect } from "react";

const userImageHostingKey = import.meta.env.VITE_REACT_APP_imgbb_api;

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

const AddImage = () => {
    const [imageURLs, setImageURLs] = useState([]);
    const [selectedImages, setSelectedImages] = useState([]); // Store selected image indexes

    // Load image URLs from local storage when the component mounts
    useEffect(() => {
        const storedImageURLs = JSON.parse(localStorage.getItem("uploadedImageURLs") || "[]");
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
                    localStorage.setItem("uploadedImageURLs", JSON.stringify(newImageURLs));
                })
                .catch((error) => console.error(error));
        }
    };

    const handleDeleteClick = () => {
        // Delete the selected images and update the state
        const newImageURLs = imageURLs.filter((_, index) => !selectedImages.includes(index));
        setImageURLs(newImageURLs);

        // Clear selected images
        setSelectedImages([]);

        // Update the stored image URLs in local storage
        localStorage.setItem("uploadedImageURLs", JSON.stringify(newImageURLs));
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
            <div className="flex">
                <div>
                    {imageURLs.length > 0 ? (
                        <>
                            <button onClick={handleDeleteClick} className="delete-selected-button">
                                Delete Selected
                            </button>
                            {imageURLs.map((url, index) => (
                                <div key={index} className="relative inline-block">
                                    <input
                                        type="checkbox"
                                        checked={selectedImages.includes(index)}
                                        onChange={() => handleImageSelect(index)}
                                        className="image-checkbox"
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
                        <p>No images uploaded</p>
                    )}
                </div>
                <div className="card">
                    <input
                        type="file"
                        accept="image/*"
                        onChange={handleFileChange}
                    />
                </div>
            </div>
        </>
    );
};

export default AddImage;
