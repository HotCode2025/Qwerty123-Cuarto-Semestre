import { Button, Card, Input } from '../components/ui'
import { useForm } from 'react-hook-form'
import axios from 'axios'

function RegisterPage() {
  
  const { register, handleSubmit, formState: { errors } } = useForm();

  const onSubmit = handleSubmit(async (data) => {
    console.log(data);
    const res = await axios.post('http://localhost:3000/api/signup', data, {
      withCredentials: true,
    });
    console.log(res);
  });


  return (
    <div className='h-[calc(100vh-64px)] flex items-center justify-center'>
      
      <Card>
      <h3 className='text-2xl font-bold' > Registro </h3>

        <form onSubmit={onSubmit} className='flex flex-col gap-4 mt-4'>
          <Input placeholder='Ingrese su Nombre'
          { ...register("name", { required: true })}></Input>
          {
            errors.name && <p className='text-red-500'>Este campo es requerido</p>
          }
          <Input type='email' placeholder='Ingrese su Email'
          {...register("email", { required: true })}></Input>
          {
            errors.email && <p className='text-red-500'>Este campo es requerido</p>
          }
          <Input type='password' placeholder='Ingrese su Contraseña'
          {...register("password", { required: true })}></Input>
          {
            errors.password && <p className='text-red-500'>Este campo es requerido</p>
          }

          <Button>Registrarse</Button>
        </form>
      </Card>
    </div>
  )
}

export default RegisterPage