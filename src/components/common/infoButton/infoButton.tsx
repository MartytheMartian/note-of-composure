import { useRef, type ReactNode } from 'react';

type InfoButtonProps = {
  title: string;
  children: ReactNode;
};

export default function InfoButton({ title, children }: InfoButtonProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);

  return (
    <>
      <button
        type="button"
        className="info-button"
        aria-label={`About ${title}`}
        onClick={() => dialogRef.current?.showModal()}
      >
        i
      </button>
      <dialog
        ref={dialogRef}
        className="info-modal"
        onClick={(e) => {
          if (e.target === e.currentTarget) dialogRef.current?.close();
        }}
      >
        <div className="info-modal-content">
          <h3>{title}</h3>
          {children}
          <div className="info-modal-actions">
            <button type="button" className="link-button" onClick={() => dialogRef.current?.close()}>
              Close
            </button>
          </div>
        </div>
      </dialog>
    </>
  );
}
