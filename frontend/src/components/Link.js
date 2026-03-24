import React, { useState, useRef, useEffect } from 'react';
import { getLinkPreview } from '../helpers/api';
import { Button } from 'primereact/button';
import ReactMarkdown from 'react-markdown';
import { deleteLink, editLink } from '../helpers/api';
import { Dialog } from 'primereact/dialog';
import { Toast } from 'primereact/toast';
import { InputText } from 'primereact/inputtext';

const Link = ({ link, onChange }) => {
  const toast = useRef(null);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(link.link);
    toast.current.show({
      severity: 'success',
      summary: 'Copied',
      detail: 'Content copied to clipboard',
      life: 3000
    });
  };

  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [linkTitle, setLinkTitle] = useState(link.title);

  const handleDelete = async () => {
    try {
      await deleteLink(link.idx);
      setShowDeleteDialog(false);

      onChange({
        severity: 'success',
        summary: 'Deleted',
        detail: 'Item successfully deleted'
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

  const handleEdit = async () => {
    try {
      await editLink(link.idx, linkTitle);
      setShowEditDialog(false);

      // Update in view and up the parent component
      setPreview({
        ...preview,
        title: linkTitle,
      });

      onChange({
        severity: 'success',
        summary: 'Edited',
        detail: 'Item successfully edited'
      });
    } catch (error) {
      console.error('Error editing link:', error);
      toast.current.show({
        severity: 'error',
        summary: 'Error',
        detail: 'Failed to edit item',
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

  const [preview, setPreview] = useState(null);

  useEffect(() => {
    const fetchPreview = async () => {
      if (isUrl) {
        try {
          let prevresult = link;
          if (!link.previewIsCached) {
            prevresult = await getLinkPreview(link.link);
            setPreview(prevresult);
          }
          const enriched = {
            ...prevresult,
            ...link,
          };

          setPreview(enriched);
          setLinkTitle(enriched.title);
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
          if (showDeleteDialog || showEditDialog) return;
          if (e.target.closest('button')) return;

          window.open(link.link, '_blank', 'noopener noreferrer');
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
          icon="pi pi-trash"
          severity="danger"
          onClick={() => setShowDeleteDialog(true)}
          tooltip="Delete"
          tooltipOptions={{ position: 'top' }}
        />
        <Button
          icon="pi pi-pencil"
          severity="success"
          onClick={() => setShowEditDialog(true)}
          tooltip="Edit Title"
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
        visible={showDeleteDialog}
        onHide={() => setShowDeleteDialog(false)}
        header="Confirm Deletion"
        footer={
          <div>
            <Button label="Delete" icon="pi pi-check" onClick={handleDelete} severity="danger" autoFocus />
          </div>
        }
      >
        <p>Are you sure you want to delete this item?</p>
      </Dialog>
      <Dialog
        visible={showEditDialog}
        onHide={() => setShowEditDialog(false)}
        header="Edit Link Title"
        style={{ width: '50vh' }}
        footer={
          <div>
            <Button
              label="Update"
              icon="pi pi-check"
              onClick={handleEdit}
              severity="success"
              autoFocus
            />
          </div>
        }
      >
        <InputText
          value={linkTitle}
          onChange={(e) => setLinkTitle(e.target.value)}
          style={{ width: '100%' }}
        />
      </Dialog>
    </div>
  );
};

export default Link;
