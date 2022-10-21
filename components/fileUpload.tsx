import React, { useRef, useState } from "react";
import { Toast } from "primereact/toast";
import { FileUpload } from "primereact/fileupload";
import { ProgressBar } from "primereact/progressbar";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { Tag } from "primereact/tag";

type Props = {
  visible: boolean;
  onHide: () => void;
  productId: string;
  addImages: (imgs: string[]) => void;
};

export const ImageUpload: React.FC<Props> = ({
  onHide,
  visible,
  productId,
  addImages,
}) => {
  const [totalSize, setTotalSize] = useState(0);
  const toast: any = useRef(null);
  const fileUploadRef: any = useRef(null);

  const onFileSelect = (e: any) => {
    const files = e.files;
    let _totalSize = totalSize;
    for (let x = 0; x < files.length; x++) {
      _totalSize += files[x].size;
    }

    setTotalSize(_totalSize);
  };

  const onFileUpload = (e: any) => {
    let _totalSize = 0;
    const imgArr: string[] = [];

    e.files.forEach((file: any) => {
      imgArr.push(`${productId}_${file.name}`);
      _totalSize += file.size || 0;
    });

    addImages(imgArr);
    setTotalSize(_totalSize);
    toast.current.show({
      severity: "info",
      summary: "Success",
      detail: "Files Uploaded ✅",
    });
  };

  const onFileRemove = (file: any, callback: () => void) => {
    setTotalSize(totalSize - file.size);
    callback();
  };

  const onFileClear = () => {
    setTotalSize(0);
  };

  const headerTemplate = (options: any) => {
    const { className, uploadButton, cancelButton } = options;
    const value = totalSize / 10000;
    const formatedValue =
      fileUploadRef && fileUploadRef.current
        ? fileUploadRef.current.formatSize(totalSize)
        : "0 B";

    return (
      <div
        className={className}
        style={{
          backgroundColor: "transparent",
          display: "flex",
          alignItems: "center",
        }}
      >
        {uploadButton}
        {cancelButton}
        <ProgressBar
          value={value}
          displayValueTemplate={() => `${formatedValue} / 1 MB`}
          style={{ width: "300px", height: "20px", marginLeft: "auto" }}
        ></ProgressBar>
      </div>
    );
  };

  const itemTemplate = (file: any, props: any) => {
    return (
      <div className="flex align items-center flex-wrap">
        <div className="flex align items-center" style={{ width: "40%" }}>
          <img
            alt={file.name}
            role="presentation"
            src={file.objectURL}
            width={100}
          />
          <span className="flex flex-col text-left ml-3">
            {file.name}
            <small>{new Date().toLocaleDateString()}</small>
          </span>
        </div>
        <Tag
          value={props.formatSize}
          severity="warning"
          className="px-3 py-2"
        />
        <Button
          type="button"
          icon="pi pi-times"
          className="p-button-outlined p-button-rounded p-button-danger ml-auto"
          onClick={() => onFileRemove(file, props.onRemove)}
        />
      </div>
    );
  };

  const emptyTemplate = () => {
    return (
      <div className="flex align items-center flex-col">
        <i className="pi pi-image !mt-3 p-5 !text-[4em] rounded-full bg-slate-100 text-slate-500"></i>
        <span className="my-5 text-xl">Drag and Drop Image Here</span>
      </div>
    );
  };

  const uploadOptions = {
    icon: "pi pi-fw pi-cloud-upload",
    iconOnly: true,
    className:
      "custom-upload-btn p-button-success p-button-rounded p-button-outlined",
  };
  const cancelOptions = {
    icon: "pi pi-fw pi-times",
    iconOnly: true,
    className:
      "custom-cancel-btn p-button-danger p-button-rounded p-button-outlined",
  };

  return (
    <Dialog
      className="w-[70%]"
      header="Upload an Image"
      visible={visible}
      onHide={onHide}
    >
      <Toast ref={toast}></Toast>
      <FileUpload
        ref={fileUploadRef}
        name={`${productId}_images[]`}
        url={"/api/s3/uploadFile"}
        multiple
        accept="image/*"
        maxFileSize={1000000}
        onUpload={onFileUpload}
        onSelect={onFileSelect}
        onError={onFileClear}
        onClear={onFileClear}
        headerTemplate={headerTemplate}
        itemTemplate={itemTemplate}
        emptyTemplate={emptyTemplate}
        uploadOptions={uploadOptions}
        cancelOptions={cancelOptions}
      />
    </Dialog>
  );
};
