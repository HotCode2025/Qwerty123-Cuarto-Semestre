import {Input} from '../components/ui/input'
import {Card} from '../components/ui/card'
import {Button} from '../components/ui/button'
function RegisterPage() {
  return (
    <div className='h-[calc(100vh-64px)] flex items-center justify-center'>
      
      <Card>
      <h3 className='text-2xl font-bold'> Registro </h3>

        <form>
          <Input placeholder='Ingrese su Nombre' />
          <Input type='email' placeholder='Ingrese su Email' />
          <Input type='password' placeholder='Ingrese su Contraseña' />
          <Button>Registrarse</Button>
        </form>
      </Card>
    </div>
  )
}

export default RegisterPage