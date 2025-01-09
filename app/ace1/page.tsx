import { Chat, Footer, Header, Prizes, Title } from "./components";

export default function Ace1() {
  return (
    <div className="flex flex-col h-screen bg-bg">
      <Header />
      <Prizes />
      <div className="h-full">
        <Title />
        <Chat />
      </div>
      <Footer />
    </div>
  );
}
