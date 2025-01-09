import { Chat, Header, Prizes, Title } from "./components";

export default function Ace1() {
  return (
    <div className="flex flex-col h-screen bg-bg">
      <Header />
      <Prizes />
      <div className="flex flex-row justify-center items-start w-full mx-auto gap-8 mb-12">
        <Title />
        <Chat />
      </div>
      {/* <Footer /> */}
    </div>
  );
}
