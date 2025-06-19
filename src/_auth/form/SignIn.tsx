import { Link, useNavigate } from "react-router-dom";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

import { SigninValidation } from "@/lib/validation";
import Loader from "@/components/shared/Loader";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";

import { useUserContext } from "@/context/AuthContext";
import { useSignInAccount } from "@/lib/react-query/queries";

const SignIn = () => {
  const toast = useToast().toast;
  const navigate = useNavigate();
  const { isLoading: isUserLoading, checkAuthUser } = useUserContext();

  const form = useForm<z.infer<typeof SigninValidation>>({
    resolver: zodResolver(SigninValidation),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const {
    mutateAsync: signInAccount,
    isPending: isLoadingAccount,
  } = useSignInAccount();

  async function onSubmit(user: z.infer<typeof SigninValidation>) {
    try {
      const session = await signInAccount({
        email: user.email,
        password: user.password,
      });

      if (!session) {
        toast({ title: "Invalid Credential", variant: "destructive" });
        return;
      }
      const isLoggedIn = await checkAuthUser();

      if (isLoggedIn) {
        form.reset();

        navigate("/");
      } else {
        toast({
          title: "Login failed. Please try again.",
          variant: "destructive",
        });

        return;
      }
    } catch (error) {
      console.log(error);
      toast({
        title: "Login failed. Please try again.",
        variant: "destructive",
      });
    }
  }

  return (
    <Form {...form}>
      <div className="flex flex-col">
        <h2 className="h3-bold md:h2-bold pt-5 sm:pt-12">
          Log in to your account
        </h2>
        <p className="text-orange-4 small-medium md:base-regular mt-2">
          Welcome back! Please enter your details.
        </p>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-2">
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
            disabled={isLoadingAccount || isUserLoading ? true : false}
          >
            {isLoadingAccount || isUserLoading ? (
              <div className="flex-center gap-2">
                <Loader /> Loading...
              </div>
            ) : (
              "Sign In"
            )}
          </Button>
        </form>
        <p className="text-small-regular text-orange-3 text-center mt-2">
          Don't have an account?
          <Link
            to="/signUp"
            className="text-orange-6 text-small-semibold ml-1 hover:underline"
          >
            Sign Up
          </Link>
        </p>
      </div>
    </Form>
  );
};

export default SignIn;
