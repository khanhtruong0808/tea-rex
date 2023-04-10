const Admin = () => {
    return (
        <div className ='flex items-center h-screen rounded-md justify-center'>
            <form className ='mx-auto p-8 px-8 rounded-lg justify-center'>
                <div className ='w-96 p-10 shadow-lg bg-gray-200 rounded-md justify-center'>
                    <div>
                        <h3 className='text-4xl font-semibold text-center'> Tea-Rex </h3>
                        <input
                            type = 'username'
                            placeholder ='username'
                            className='w-full text-black my-2 py-4 bg-transparent border-b border-black outline-none focus:outline-none'/>
                        <input
                            type = 'password'
                            placeholder ='password'
                            className='w-full text-black my-2 py-4 bg-transparent border-b border-black outline-none focus:outline-none'/>
                    </div>
                    <div className ='mt-3 flex'>
                        <div>
                        <a href='#' className='text-black text-xs'>Forgot Username / Password?</a>
                        </div>
                    </div>
                    <div className= 'mt-5 justify-center'>
                        <button className= 'w-full border-green-500 bg-green-500 text-white py-1 px-5 rounded-md'>Sign In</button>
                    </div>
                </div>
            </form>
        </div>
    )
    
  };
  export default Admin;
  