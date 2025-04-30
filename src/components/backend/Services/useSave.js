import { useState } from "react";
import apiRepository from "../Repository/apiAxiosRepository.js";
import HttpMethod from "../../Enums/httpMethods.js";

const useSave = () => {
    const [isSaving, setIsSaving] = useState(false);
    const [saveError, setSaveError] = useState(null);

    // Save data with support for multiple HTTP methods
    const saveData = async (url, dataToSave, method = HttpMethod.POST) => {
        setIsSaving(true);
        setSaveError(null);
        try {
            const result = await apiRepository.saveData(url, dataToSave, method);
            return result;
        } catch (err) {
            setSaveError(err.message);
            throw err;
        } finally {
            setIsSaving(false);
        }
    };

    return { saveData, isSaving, saveError };
};

export default useSave;