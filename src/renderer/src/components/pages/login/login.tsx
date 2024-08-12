import loginImage from '@renderer/assets/images/login.png'
import logo from '@renderer/assets/images/logo.svg'
import LoginForm from '@renderer/components/forms/login-form'

const Login = () => {
  return (
    <main className="flex min-h-screen flex-row">
      {/* left section  */}
      <section className={'w-full h-screen md:w-[50%]'}>
        <img src={loginImage} className="w-full h-full" />
      </section>

      {/* Right section */}
      <section className="h-screen w-[50%] flex flex-col items-center justify-center gap-4">
        <div className="flex justify-center flex-col items-center gap-2">
          <div>
            <img src={logo} className="h-[80px] w-[80px]" alt="logo" />
          </div>
          <div className="text-center">
            <h1 className="font-bold text-4xl">نظام إدارة الطلبات</h1>
            <span className="font-bold text-4xl">(OMS)</span>
          </div>
        </div>
        <div className="flex justify-center flex-col items-center">
          <div>
            <h1 className="text-3xl font-bold">تسجيل الدخول</h1>
            <LoginForm />
          </div>
        </div>
      </section>
    </main>
  )
}

export default Login
