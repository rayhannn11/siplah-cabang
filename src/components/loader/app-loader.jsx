export default function AppLoader() {
  return (
    <div className="w-screen h-screen flex flex-col items-center justify-center bg-white">
      <div className="loader scale-[0.65] sm:scale-100">
        <div className="box box0">
          <div></div>
        </div>
        <div className="box box1">
          <div></div>
        </div>
        <div className="box box2">
          <div></div>
        </div>
        <div className="box box3">
          <div></div>
        </div>
        <div className="box box4">
          <div></div>
        </div>
        <div className="box box5">
          <div></div>
        </div>
        <div className="box box6">
          <div></div>
        </div>
        <div className="box box7">
          <div></div>
        </div>
        <div className="ground">
          <div></div>
        </div>
      </div>
      <p className="z-50 mt-4 text-lg font-semibold text-gray-700 tracking-wide">
        Loading <span className="text-primary">SIPLah Cabang</span>...
      </p>
    </div>
  );
}
