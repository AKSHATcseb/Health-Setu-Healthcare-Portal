const TopBar = ( {hospitalName, email, phone, street, city, state, pincode, upiId} ) => {
  return (
    <div className="flex justify-between items-center">
      <div>
        <h2 className="text-3xl font-bold mb-2">{hospitalName}</h2>
        <div className="text-gray-500 text-sm"> {email} </div>
        <div className="text-gray-500 text-sm"> {phone} </div>
        <div className="text-gray-500 text-sm"> {street}, {city}, {state}, {pincode}  </div>
        <div className="text-gray-500 text-sm"> {upiId}  </div>
      </div>

      <div className="flex items-center gap-4">
        <span className="text-green-600 bg-green-50 px-4 py-1 rounded-full text-sm">
          ● System Online
        </span>
      </div>
    </div>
  );
};

export default TopBar;
