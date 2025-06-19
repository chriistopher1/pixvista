import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";

import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Loader from "@/components/shared/Loader";
import { useToast } from "@/components/ui/use-toast";

import { signUpValidation } from "@/lib/validation";
import { useCreateUserAuth, useSignInAccount } from "@/lib/react-query/queries";

import { useUserContext } from "@/context/AuthContext";

const SignUp = () => {
  const navigate = useNavigate();
  const toast = useToast();
  const { checkAuthUser, isLoading: isUserLoading } = useUserContext();

  const form = useForm<z.infer<typeof signUpValidation>>({
    resolver: zodResolver(signUpValidation),
    defaultValues: {
      name: "",
      username: "",
      email: "",
      password: "",
    },
  });

  const { mutateAsync: createUserAuth, isPending: isCreatingAccount } =
    useCreateUserAuth();
  const { mutateAsync: signInAccount, isPending: isLoadingAccount } =
    useSignInAccount();

  async function onSubmit(user: z.infer<typeof signUpValidation>) {
    try {
      const newAccount = await createUserAuth(user);

      if (!newAccount) {
        toast.toast({
          title: "Something went wrong. Please register your account again",
        });
        return;
      }

      const session = await signInAccount({
        email: user.email,
        password: user.password,
      });

      if (!session) {
        toast.toast({
          title: "Something went wrong. Please login your new account",
        });
        return;
      }

      const isLoggedIn = await checkAuthUser();

      if (isLoggedIn) {
        form.reset();

        navigate("/");
      } else {
        toast.toast({ title: "Login failed. Please try again." });

        return;
      }
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <Form {...form}>
      <div className="flex flex-col">
        <h2 className="h3-bold md:h2-bold pt-5 sm:pt-12">
          Create a new account
        </h2>
        <p className="text-orange-4 small-medium md:base-regular mt-2">
          To use PixVista, Please enter your details
        </p>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-2">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="shad-input_label">
                  Name <FormMessage className="shad-form_message" />
                </FormLabel>
                <FormControl>
                  <Input
                    placeholder="Name"
                    {...field}
                    autoComplete="off"
                    className="shad-input "
                  />
                </FormControl>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="username"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="shad-input_label">
                  Username <FormMessage className="shad-form_message" />
                </FormLabel>
                <FormControl>
                  <Input
                    placeholder="Username"
                    {...field}
                    autoComplete="off"
                    className="shad-input"
                  />
                </FormControl>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="shad-input_label">
                  Email <FormMessage className="shad-form_message" />
                </FormLabel>
                <FormControl>
                  <Input
                    placeholder="Email"
                    {...field}
                    autoComplete="off"
                    className="shad-input"
                    type="email"
                  />
                </FormControl>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="shad-input_label">
                  Password <FormMessage className="shad-form_message" />
                </FormLabel>
                <FormControl>
                  <Input
                    placeholder="Password"
                    {...field}
                    autoComplete="off"
                    className="shad-input"
                    type="password"
                  />
                </FormControl>
              </FormItem>
            )}
          />
          <Button
            type="submit"
            className="shad-button_primary w-full"
            disabled={
              isCreatingAccount || isLoadingAccount || isUserLoading
                ? true
                : false
            }
          >
            {isCreatingAccount || isLoadingAccount || isUserLoading ? (
              <div className="flex-center gap-2">
                <Loader /> Loading...
              </div>
            ) : (
              "Sign Up"
            )}
          </Button>
        </form>
        <p className="text-small-regular text-orange-3 text-center mt-2">
          Already have an account?
          <Link
            to="/signIn"
            className="text-orange-6 text-small-semibold ml-1 hover:underline"
          >
            Sign In
          </Link>
        </p>
      </div>
    </Form>
  );
};

export default SignUp;
