import { useCallback } from "react";
import axios from "axios";

// Helper: Generate SHA‑1 signature using the Web Crypto API
async function generateSignature(message) {
  const encoder = new TextEncoder();
  const data = encoder.encode(message);
  const hashBuffer = await window.crypto.subtle.digest("SHA-1", data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("");
  return hashHex;
}

function useCloudinaryDeleteByPublicId() {
  const deleteMediaByPublicId = useCallback(async (publicId) => {
    try {
      // Construct the destroy endpoint URL by replacing "upload" with "destroy"
      const destroyUrl = process.env.REACT_APP_CLOUDINARY_URL.replace(
        "upload",
        "destroy"
      );
      const timestamp = Math.floor(Date.now() / 1000);
      const apiSecret = process.env.REACT_APP_CLOUDINARY_API_SECRET.trim();
      // Signature string: sorted alphabetically: "public_id=<publicId>&timestamp=<timestamp>"
      const signatureString = `public_id=${publicId}&timestamp=${timestamp}${apiSecret}`;
      const signature = await generateSignature(signatureString);

      const formData = new FormData();
      formData.append("public_id", publicId);
      formData.append("timestamp", timestamp);
      formData.append("api_key", process.env.REACT_APP_CLOUDINARY_API_KEY);
      formData.append("signature", signature);

      const response = await axios.post(destroyUrl, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      return response.data;
    } catch (error) {
      console.error("Delete error:", error);
      throw error;
    }
  }, []);

  return { deleteMediaByPublicId };
}

export default useCloudinaryDeleteByPublicId;
