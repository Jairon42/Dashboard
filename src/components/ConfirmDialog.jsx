import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogFooter,
  } from "@/components/ui/dialog";
  import { Button } from "@/components/ui/button";
  
  const ConfirmDialog = ({
    open,
    onClose,
    onConfirm,
    title,
    message,
    confirmText = "Confirmar",
    cancelText = "Cancelar",
  }) => {
    return (
      <Dialog open={open} onOpenChange={onClose}>
        <DialogContent>
          <DialogHeader>{title}</DialogHeader>
          <p className="text-sm text-muted-foreground">{message}</p>
          <DialogFooter>
            <Button variant="ghost" onClick={() => onClose(false)}>
              {cancelText}
            </Button>
            <Button onClick={onConfirm}>{confirmText}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  };
  
  export default ConfirmDialog;
  