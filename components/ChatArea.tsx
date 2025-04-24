const ChatArea = () => {
    return (
      <div className="max-w-[1100px] mx-auto border border-gray-300 rounded-lg shadow-md overflow-hidden bg-white">
        <div className="p-4 border-b border-gray-300 bg-gradient-to-r from-blue-500 to-purple-600">
          <h2 className="text-xl font-semibold text-center text-white">MicroLoan Assistant</h2>
        </div>
  
        <div className="h-[400px] overflow-y-auto p-4 bg-gray-50"></div>
  
        <form className="border-t border-gray-300 p-4 bg-white">
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="Type your message here..."
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              Send
            </button>
          </div>
        </form>
      </div>
    )
  }
  
  export default ChatArea
  