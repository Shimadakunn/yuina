import { Button } from "@/components/ui/button";

export default function Footer() {
  return (
    <div className="flex justify-between items-center h-full px-16">
      <div className="flex items-center gap-4">
        <Button variant="noShadow" className="font-black rounded-2xl border-1">
          遊び方
        </Button>
        <button className="text-black">遊び方</button>
      </div>
    </div>
  );
}
