import { Button } from "@/components/ui/button";
import {
  ClerkLoaded,
  ClerkLoading,
  SignedIn,
  SignedOut,
  SignUpButton,
  SignInButton,
} from "@clerk/nextjs";
import { Loader } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <div>
      <main className="w-full bg-gray-100">
        <section className="bg-emerald-400 py-10 sm:py-20">
          <div className="container mx-auto px-4">
            <div className="flex flex-col lg:flex-row items-center">
              <div className="w-full lg:w-1/2 mb-8 lg:mb-0">
                <p className="text-emerald-800 font-bold py-5">
                  BIENVENIDO A MEDBOOST 👋
                </p>
                <h1 className="text-3xl sm:text-4xl font-bold text-white mb-4">
                  Estudia medicina con la máxima eficiencia.
                </h1>
                <p className="text-lg sm:text-xl text-white mb-8">
                  La repetición espaciada y el recuerdo activo son métodos
                  científicos que te van a permitir memorizar todo lo que
                  estudias.
                </p>
                <div>
                  <ClerkLoading>
                    <Loader className="h-5 w-5 text-muted-foreground animate-spin" />
                  </ClerkLoading>
                  <ClerkLoaded>
                    <SignedOut>
                      <SignUpButton
                        mode="modal"
                        afterSignInUrl="/learn"
                        afterSignUpUrl="/learn"
                      >
                        <Button
                          size="lg"
                          variant="secondary"
                          className="mr-4 mb-4"
                        >
                          Empezar
                        </Button>
                      </SignUpButton>
                      <SignInButton
                        mode="modal"
                        afterSignInUrl="/learn"
                        afterSignUpUrl="/learn"
                      >
                        <Button size="lg" variant="primaryOutline">
                          Ya tengo una cuenta
                        </Button>
                      </SignInButton>
                    </SignedOut>
                    <SignedIn>
                      <Button size="lg" variant="secondary" asChild>
                        <Link href="/learn">Continuar aprendiendo</Link>
                      </Button>
                    </SignedIn>
                  </ClerkLoaded>
                </div>
              </div>
              <div className="w-full lg:w-1/2">
                <Image
                  src="/section-hero.svg"
                  alt="Estudiantes de medicina"
                  height={410}
                  width={580}
                  layout="responsive"
                />
              </div>
            </div>
          </div>
        </section>

        <section className="bg-yellow-50 -mt-12 sm:-mt-24 mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-8 sm:py-12 shadow-lg rounded-lg">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="text-center flex flex-col items-center">
              <Image
                className="py-5"
                src="/check.svg"
                width={40}
                height={40}
                alt="check-icon"
              />
              <h3 className="text-xl font-bold mb-2 text-emerald-400">
                Aumenta tu productividad
              </h3>
              <p className="text-emerald-400">
                Aumenta tu productividad hasta 10 veces con tan solo un momento
                al día utilizando técnicas basadas en evidencia.
              </p>
            </div>
            <div className="text-center flex flex-col items-center">
              <Image
                className="py-5"
                src="/check.svg"
                width={40}
                height={40}
                alt="check-icon"
              />
              <h3 className="text-xl font-bold mb-2 text-emerald-400">
                Recuerda todo lo que estudiaste a largo plazo
              </h3>
              <p className="text-emerald-400">
                El éxito a largo plazo depende completamente del aprendizaje a
                largo plazo. Recuerde todo lo que estudió por mucho más tiempo
                que con técnicas tradicionales.
              </p>
            </div>
            <div className="text-center flex flex-col items-center">
              <Image
                className="py-5"
                src="/check.svg"
                width={40}
                height={40}
                alt="check-icon"
              />
              <h3 className="text-xl font-bold mb-2 text-emerald-400">
                Acelera tu rendimiento en la facultad
              </h3>
              <p className="text-emerald-400">
                Obtén las mejores calificaciones en todas tus materias sin pasar
                horas estudiando temas una y otra vez sin cesar como lo requiere
                el aprendizaje de la medicina.
              </p>
            </div>
          </div>
        </section>

        <section className="bg-gray-100 py-20">
          <div className="container mx-auto px-4">
            <h2 className="text-4xl font-bold mb-4 text-center text-emerald-400">
              Pilares
            </h2>
            <h3 className="text-3xl font-bold mb-12 text-center">
              Práctico, increíblemente rápido y moderno.
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-12">
              <div className="text-center">
                <div className="inline-block bg-white rounded-full p-6 mb-6">
                  <Image
                    src="/icon-1.svg"
                    width={60}
                    height={60}
                    alt="check-icon"
                  />
                </div>
                <p className="text-lg text-gray-700">
                  Actualmente, Medfy te brinda con miles de flashcards y choices
                  del ciclo básico biomédico.
                </p>
              </div>
              <div className="text-center">
                <div className="inline-block bg-white rounded-full p-6 mb-6">
                  <Image
                    src="/icon-2.svg"
                    width={60}
                    height={60}
                    alt="check-icon"
                  />
                </div>
                <p className="text-lg text-gray-700">
                  Utiliza el Active Recall para esforzar tu cerebro a recordar
                  lo que has estudiado.
                </p>
              </div>
              <div className="text-center">
                <div className="inline-block bg-white rounded-full p-6 mb-6">
                  <Image
                    src="/icon-3.svg"
                    width={60}
                    height={60}
                    alt="check-icon"
                  />
                </div>
                <p className="text-lg text-gray-700">
                  Practica con la metacognición, la capacidad de autoregular el
                  proceso de aprendizaje.
                </p>
              </div>
              <div className="text-center">
                <div className="inline-block bg-white rounded-full p-6 mb-6">
                  <Image
                    src="/icon-4.svg"
                    width={60}
                    height={60}
                    alt="check-icon"
                  />
                </div>
                <p className="text-lg text-gray-700">
                  Con base a tu calificación, Medfy te va a recordar de repasar
                  los contenidos, optimizando tu proceso de memorización.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="bg-yellow-50 py-12">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold mb-8 text-center text-teal-600">
              Qué es la repetición espaciada?
            </h2>
            <div className="flex flex-col lg:flex-row items-center justify-between">
              <div className="w-full lg:w-1/2 mb-8 lg:mb-0">
                <Image
                  src="/rp.svg"
                  alt="Estudiantes de medicina"
                  height={535}
                  width={525}
                  layout="responsive"
                  className="rounded-lg shadow-lg"
                />
              </div>
              <div className="w-full lg:w-1/2 lg:pl-12">
                <p className="text-gray-600 text-lg font-bold mb-4">
                  Funciona porque es un método que se enfoca en tus debilidades.
                </p>
                <p className="text-gray-600 text-base mb-6">
                  Aprender con las fallas es un factor crucial por el cual el
                  cerebro se desarrolla. Medfy trabaja en conjunto con tu y con
                  la metacognición para ayudarte a identificar y cualificar sus
                  debilidades en la materia estudiada, y por medio de un
                  algoritmo computacional llamado SuperMemo (de Super Memoria)
                  que está relacionado con la curva del olvido (este indica
                  cuanto tiempo se mantiene un contenido en el cerebro) optimiza
                  su estudio para que retengas los conceptos de forma
                  prolongada.
                </p>
                <p className="text-gray-600 text-base">
                  En síntesis, la repetición espaciada es un método en que los
                  conceptos nuevos o los más difíciles sean estudiados con más
                  frecuencia que los conceptos más fáciles de acordarse. Así
                  desafiando y forzando tu memoria en sus áreas más débiles de
                  conocimiento.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="bg-gray-100 py-12">
          <div className="container mx-auto px-4">
            <h2 className="text-2xl sm:text-3xl font-bold mb-8 text-center">
              Acuérdese más con menos tiempo de estudio y evite el burnout
            </h2>
            <div className="flex flex-col lg:flex-row items-center">
              <div className="w-full lg:w-1/2 mb-8 lg:mb-0">
                <p className="text-gray-600">
                  La repetición espaciada promueve un aprendizaje efectivo y
                  eficiente.
                </p>
                <p className="text-gray-600">
                  Nos asegura la clave en la retención.
                </p>
                <ul className="list-disc pl-6">
                  <li>Un principio: el cerebro es un músculo.</li>
                  <li>Más con que la clave en la retención.</li>
                  <li>
                    Notify le ayuda a que su cerebro obtenga más fuerza de
                    manera más efectiva que los métodos de estudio
                    tradicionales.
                  </li>
                </ul>
              </div>
              <div className="w-full lg:w-1/2">
                <Image
                  src="/grafico.svg"
                  alt="Estudiantes de medicina"
                  height={480}
                  width={600}
                  layout="responsive"
                />
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
