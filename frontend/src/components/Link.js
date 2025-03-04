import React, { useState, useRef, useEffect } from 'react';
import { getLinkPreview, updateDescription } from '../helpers/api';
import { Button } from 'primereact/button';
import ReactMarkdown from 'react-markdown';
import { deleteLink } from '../helpers/api';
import { Dialog } from 'primereact/dialog';
import { Toast } from 'primereact/toast';
import { InputTextarea } from 'primereact/inputtextarea';


const Link = ({ link, onDelete }) => {
  const toast = useRef(null);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [preview, setPreview] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [description, setDescription] = useState(link.description || {});

  const copyToClipboard = () => {
    navigator.clipboard.writeText(link.link);
    toast.current.show({
      severity: 'success',
      summary: 'Copied',
      detail: 'Content copied to clipboard',
      life: 3000
    });
  };

  const updateDescription = async () => {
    console.log('sending description', description);
    const updateResult = await updateDescription(link.idx, description);
    console.log('got this update result', updateResult);
    setShowEditModal(false);
  }

  const handleDelete = async () => {
    try {
      await deleteLink(link.idx);
      if (onDelete) {
        onDelete(link.idx);
      }
      setShowDeleteDialog(false);
      console.log('Creating success toast');
      toast.current.show({
        severity: 'success',
        summary: 'Deleted',
        detail: 'Item successfully deleted',
        life: 3000
      });
    } catch (error) {
      console.error('Error deleting link:', error);
      toast.current.show({
        severity: 'error',
        summary: 'Error',
        detail: 'Failed to delete item',
        life: 3000
      });
    }
  };

  // URL validation regex
  const urlRegex = /^https?:\/\//;

  const isUrl = urlRegex.test(link.link);

  // Format the date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString();
  };

  useEffect(() => {
    const fetchPreview = async () => {
      if (isUrl) {
        try {
          if (link.description) {
            setPreview(link.description);
          } else {
            const prevresult = await getLinkPreview(link.link);
            console.log(`Got this preview:`, prevresult);
            setPreview(prevresult);
          }
        } catch (error) {
          console.error('Error fetching preview:', error);
        }
      }
    };

    fetchPreview();
  }, [link.link, isUrl]); // Only re-run if the link or isUrl changes

  return (
    <div
      className="link-card"
      style={{
        margin: '1rem',
        padding: '1rem',
        border: '1px solid #ddd',
        borderRadius: '8px',
        maxWidth: '500px',
        ...(isUrl && { cursor: 'pointer' })  // Only add pointer cursor if it's a URL
      }}
      {...(isUrl && {
        onClick: (e) => {
          // Only open URL if not clicking on buttons
          if (!e.target.closest('button')) {
            window.open(link.link, '_blank', 'noopener noreferrer');
          }
        }
      })}
    >
      <Toast ref={toast} />
      {isUrl ? (
        // Handle as link
        <>
          {preview && (
            <div>
              <h3>{preview.title}</h3>
              {
                preview.image && (
                  <img src={preview.image} alt={preview.title} style={{maxWidth: '100%'}} />
                )
              }
              <p>{preview.description}</p>
            </div>
          )}
          {/* </a> */}
          <div style={{
            fontSize: '0.8rem',
            color: '#666',
            marginTop: '0.5rem',
            textAlign: 'right'
          }}>
            Added: {formatDate(link.date)}
          </div>
        </>
      ) : (
        // Handle as markdown
        <>
          <div className="markdown-content">
            <ReactMarkdown>{link.link}</ReactMarkdown>
          </div>
          <div style={{
            fontSize: '0.8rem',
            color: '#666',
            marginTop: '0.5rem',
            textAlign: 'right'
          }}>
            {formatDate(link.date)}
          </div>
        </>
      )}

      <div style={{marginTop: '1rem', display: 'flex', justifyContent: 'flex-end', gap: '0.5rem'}}>
        <Button
          icon="pi pi-pen-to-square"
          severity="success"
          onClick={() => setShowEditModal(true)}
          tooltip="Edit Description"
          tooltipOptions={{ position: 'top' }}
        />
        <Button
          icon="pi pi-trash"
          severity="danger"
          onClick={() => setShowDeleteDialog(true)}
          tooltip="Delete"
          tooltipOptions={{ position: 'top' }}
        />
        <Button
          icon="pi pi-copy"
          onClick={copyToClipboard}
          tooltip="Copy content"
          tooltipOptions={{ position: 'top' }}
        />
      </div>

      <Dialog
        visible={showEditModal}
        onHide={() => setShowEditModal(false)}
        header="Edit Description"
        footer={
          <Button label="Save" icon="pi pi-check" onClick={updateDescription} severity="success" autoFocus />
        }
      >
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-start',
            paddingBottom: '1rem',
          }}
        >
          <h3>Title</h3>
          <InputTextarea
            value={description.title}
            onChange={(e) => setDescription({ ...description, title: e.target.value })}
            rows={5}
            cols={30}
          />
          <h3>Description</h3>
          <InputTextarea
            value={description.description}
            onChange={(e) => setDescription({ ...description, 'description': e.target.value })}
            rows={5}
            cols={30}
          />
        </div>
      </Dialog>

      {/* Delete confirmation dialog */}
      <Dialog
        visible={showDeleteDialog}
        onHide={() => setShowDeleteDialog(false)}
        header="Confirm Deletion"
        footer={
          <div>
            <Button label="No" icon="pi pi-times" onClick={() => setShowDeleteDialog(false)} className="p-button-text" />
            <Button label="Yes" icon="pi pi-check" onClick={handleDelete} severity="danger" autoFocus />
          </div>
        }
      >
        <p>Are you sure you want to delete this item?</p>
      </Dialog>
    </div>
  );
};

export default Link;
