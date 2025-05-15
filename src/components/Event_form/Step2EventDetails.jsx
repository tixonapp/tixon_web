import React, { useEffect, useRef, useState } from 'react';
import { supabase } from '../../supabase/supabaseClient';

export default function Step2EventDetails({ formRef, formData, handleChange }) {
  const autocompleteRef = useRef(null);
  const locationInputRef = useRef(null);
  const [uploading, setUploading] = useState(false);
  const [posterFile, setPosterFile] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [previewUrl, setPreviewUrl] = useState(formData.poster_url || '');
  const [placeSelected, setPlaceSelected] = useState(false);
  
  const BUCKET_NAME = 'imagestore'; // Define bucket name as constant

  useEffect(() => {
    // Load Google Maps API script
    const loadGoogleMapsScript = () => {
      const googleMapScript = document.createElement('script');
      googleMapScript.src = `https://maps.googleapis.com/maps/api/js?key=${import.meta.env.VITE_GOOGLE_MAPS_API_KEY}&libraries=places`;
      googleMapScript.async = true;
      googleMapScript.defer = true;
      window.document.body.appendChild(googleMapScript);
      
      googleMapScript.addEventListener('load', initPlacesAutocomplete);
    };

    // Initialize Google Places Autocomplete
    const initPlacesAutocomplete = () => {
      if (locationInputRef.current && window.google) {
        autocompleteRef.current = new window.google.maps.places.Autocomplete(
          locationInputRef.current,
          { types: ['establishment', 'geocode'] }
        );
        
        autocompleteRef.current.addListener('place_changed', () => {
          const place = autocompleteRef.current.getPlace();
          setPlaceSelected(true);
          
          if (place.formatted_address) {
            // Create a synthetic event to update the location field
            const event = {
              target: {
                name: 'location',
                value: place.formatted_address 
              }
            };
            handleChange(event);
          }
        });
      }
    };

    // Check if Google Maps API is already loaded
    if (!window.google) {
      loadGoogleMapsScript();
    } else {
      initPlacesAutocomplete();
    }

    // Add blur event handler to catch cases when user clicks outside after typing
    const handleBlur = (e) => {
      setTimeout(() => {
        if (locationInputRef.current && 
            !placeSelected && 
            autocompleteRef.current && 
            (!autocompleteRef.current.getPlace() || 
             !autocompleteRef.current.getPlace().formatted_address)) {
          // If clicking outside without selecting a place, we can still
          // use whatever text is in the input as the location value
          const event = {
            target: {
              name: 'location',
              value: locationInputRef.current.value 
            }
          };
          handleChange(event);
        }
      }, 150);
    };

    if (locationInputRef.current) {
      locationInputRef.current.addEventListener('blur', handleBlur);
    }

    // Cleanup function
    return () => {
      if (locationInputRef.current) {
        locationInputRef.current.removeEventListener('blur', handleBlur);
      }
      if (autocompleteRef.current && window.google) {
        window.google.maps.event.clearInstanceListeners(autocompleteRef.current);
      }
    };
  }, [handleChange, placeSelected]);

  // Handle touch events that might interfere with selections
  useEffect(() => {
    // This helps with iOS touch event issues
    const handlePacContainerTouchEnd = (e) => {
      e.stopImmediatePropagation();
      
      // Small delay to ensure the place is selected before blur
      setTimeout(() => {
        if (autocompleteRef.current && autocompleteRef.current.getPlace()) {
          const place = autocompleteRef.current.getPlace();
          setPlaceSelected(true);
          
          if (place.formatted_address) {
            const event = {
              target: {
                name: 'location',
                value: place.formatted_address 
              }
            };
            handleChange(event);
          }
        }
      }, 300);
    };
    
    // Add observer for when pac-container is added to the DOM
    const observer = new MutationObserver((mutations) => {
      const pacContainer = document.querySelector('.pac-container');
      if (pacContainer) {
        pacContainer.addEventListener('touchend', handlePacContainerTouchEnd);
        pacContainer.addEventListener('mousedown', () => {
          // Prevent immediate blur when clicking in the dropdown
          setPlaceSelected(true);
        });
      }
    });
    
    observer.observe(document.body, {
      childList: true,
      subtree: true
    });
    
    return () => {
      observer.disconnect();
      const pacContainer = document.querySelector('.pac-container');
      if (pacContainer) {
        pacContainer.removeEventListener('touchend', handlePacContainerTouchEnd);
      }
    };
  }, [handleChange]);

  // Handle manual input in the location field
  const handleLocationChange = (e) => {
    setPlaceSelected(false);
    handleChange(e);
  };

  // Handle poster file selection
  const handlePosterFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPosterFile(file);
      // Create a preview URL for the selected image
      const objectUrl = URL.createObjectURL(file);
      setPreviewUrl(objectUrl);
      console.log("Preview URL created:", objectUrl);
    }
  };

  // Upload poster to Supabase storage
  const uploadPoster = async () => {
    if (!posterFile) return;
    
    try {
      setUploading(true);
      setUploadProgress(0);
      // Generate a unique file name to avoid conflicts
      const fileExt = posterFile.name.split('.').pop();
      const fileName = `${Math.random().toString(36).substring(2, 15)}_${Date.now()}.${fileExt}`;
      const filePath = `event_posters/${fileName}`;
      
      console.log("Starting upload for file:", fileName);
      
      // Try to update the bucket to be public
      await supabase.storage.updateBucket(BUCKET_NAME, {
        public: true
      }).catch(err => console.log("Bucket update note:", err.message));
      
      // Upload the file to Supabase storage
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from(BUCKET_NAME)
        .upload(filePath, posterFile, {
          cacheControl: '3600',
          upsert: true,
          onUploadProgress: (progress) => {
            const percent = Math.round((progress.loaded / progress.total) * 100);
            setUploadProgress(percent);
          },
        });
      
      if (uploadError) {
        throw uploadError;
      }
      
      console.log("Upload successful:", uploadData);
      
      // Add a small delay to ensure the file is processed
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Generate a signed URL for the uploaded file
      const { data: signedUrlData, error: signedUrlError } = await supabase.storage
        .from(BUCKET_NAME)
        .createSignedUrl(filePath, 60 * 60 * 24 * 365); // 1 year expiry
      
      if (signedUrlError) {
        throw signedUrlError;
      }
      
      const posterUrl = signedUrlData.signedUrl;
      console.log("Generated signed URL:", posterUrl);
      
      // Update the form data with the poster URL
      const event = {
        target: {
          name: 'poster_url',
          value: posterUrl
        }
      };
      handleChange(event);
      
      // Set form preview to the generated URL
      setPreviewUrl(posterUrl);
      
      setUploading(false);
      setUploadProgress(100);
      
    } catch (error) {
      console.error('Error uploading poster:', error);
      alert(`Upload failed: ${error.message}`);
      setUploading(false);
    }
  };

  // When a file is selected, automatically start the upload
  useEffect(() => {
    if (posterFile) {
      uploadPoster();
    }
  }, [posterFile]);

  return (
    <form ref={formRef} className="form-section">
      <div className="form-group">
        <label>Event Name*</label>
        <input name="event_name" value={formData.event_name} onChange={handleChange} required />
      </div>
      <div className="form-group">
        <label>Mode*</label>
        <select name="mode" value={formData.mode} onChange={handleChange} required>
          <option>In-person</option>
          <option>Virtual</option>
          <option>Hybrid</option>
        </select>
      </div>
      <div className="form-group">
        <label>Start Date-Time*</label>
        <input name="start_datetime" type="datetime-local" value={formData.start_datetime} onChange={handleChange} required />
      </div>
      <div className="form-group">
        <label>End Date-Time*</label>
        <input name="end_datetime" type="datetime-local" value={formData.end_datetime} onChange={handleChange} required />
      </div>
      <div className="form-group">
        <label>Event Poster*</label>
        <div className="poster-upload-container">
          {previewUrl && (
            <div className="poster-preview">
              <img 
                src={previewUrl} 
                alt="Event poster preview" 
                style={{ maxWidth: '100%', maxHeight: '200px' }} 
                onError={(e) => {
                  console.error("Image failed to load:", previewUrl);
                  e.target.src = "https://via.placeholder.com/400x200?text=Image+Load+Error";
                }}
              />
            </div>
          )}
          <input 
            type="file" 
            accept="image/*" 
            onChange={handlePosterFileChange} 
            disabled={uploading}
          />
          {uploading && (
            <div className="upload-progress">
              <progress value={uploadProgress} max="100"></progress>
              <span>{uploadProgress}%</span>
            </div>
          )}
          <input 
            type="hidden" 
            name="poster_url" 
            value={formData.poster_url || ''} 
          />
        </div>
        <small className="form-text">Upload an image for your event poster (JPG, PNG, etc.)</small>
      </div>
      <div className="form-group">
        <label>Location*</label>
        <input 
          ref={locationInputRef}
          name="location" 
          value={formData.location || ''} 
          onChange={handleLocationChange} 
          placeholder="Start typing to search for a location..."
          required 
          autoComplete="off"
        />
        {/* <small className="form-text">Use Google Maps to search for a location</small> */}
        <input type="hidden" name="location_data" value={formData.location_data || '{}'} />
      </div>
      <div className="form-group">
        <label>Description*</label>
        <textarea name="description" value={formData.description || ''} onChange={handleChange} required />
      </div>
      <div className="form-group">
        <label>Category*</label>
        <input name="category" value={formData.category || ''} onChange={handleChange} required />
      </div>
      <div className="form-group">
        <label>Agenda</label>
        <textarea name="agenda" value={formData.agenda || ''} onChange={handleChange} />
      </div>
    </form>
  );
}
