import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogTitle,
  DialogDescription,
  DialogClose,
} from "@/components/ui/dialog";
import { Heart, Twitter } from "lucide-react";

export default function Footer() {
  return (
    <div className="flex justify-between items-center h-full px-16">
      <Dialog>
        <DialogTrigger>
          <Button
            variant="noShadow"
            className="font-black rounded-2xl border-1"
          >
            遊び方
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogTitle>遊び方</DialogTitle>
          <DialogDescription>遊び方</DialogDescription>
        </DialogContent>
      </Dialog>
      <div className="flex items-center gap-4">
        <Button
          variant="noShadow"
          className="font-black rounded-[0.6rem] border-1 text-xs bg-gray-200 text-gray-500"
        >
          <Twitter strokeWidth={3} />
          <div className="flex items-center gap-1">
            フォローしてね
            <Heart strokeWidth={1.5} className="w-3 h-3" />
          </div>
        </Button>
      </div>
    </div>
  );
}
