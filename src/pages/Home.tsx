import { cn } from "@/lib/utils";
import { Link, NavLink } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {AudioIcon, HeroImg, LandImg, Logo, OtoLogo, TargetImg} from "@/assets"

const HomePage = () => {
  return (
    <div className="container min-h-screen flex flex-col text-foreground px-[60px] py-12">
      <header className="flex items-center justify-between">
        <div className="shrink-0">
          <img src={Logo} alt="cliquify logo" />
        </div>

        <nav className="flex items-center gap-8">
          <NavLink
            to="/"
            end
            className={({ isActive }) =>
              cn(
                isActive
                  ? "border-b-4 border-mainColor font-semibold text-xl text-blackColor"
                  : ""
              )
            }
          >
            Home
          </NavLink>
          <a
            href="#our-vision"
            className="font-semibold text-xl text-grayColor hover:border-b-4 hover:border-mainColor"
          >
            Our Vision
          </a>
        </nav>

        <Button
          asChild
          className="bg-mainColor hover:bg-mainColor text-white text-xl font-semibold w-[180px] h-[54px] rounded-lg"
        >
          <Link to="/sign-in">Get started Now</Link>
        </Button>
      </header>

      {/* Hero Section */}
      <section className="flex justify-between items-center gap-4 mt-20">
        <div className="max-w-[596px] flex flex-col gap-8">
          <h1 className="text-[54px] font-medium font-rubik">
            <div className="inline-flex">
              <img src={AudioIcon} alt="microphone" />
            </div>{" "}
            <span className="font-semibold text-secondaryColor">Unleash</span>{" "}
            your ads with the new{" "}
            <span className="text-mainColor">Cliquify</span> feature!
          </h1>
          <p className="text-xl text-grayColor">
            Create, manage, and track your ad campaigns—all in one place, right
            inside Cliquify.
          </p>
          <Button
            asChild
            className="bg-mainColor hover:bg-mainColor text-white text-xl font-semibold w-[160px] h-[54px] rounded-lg"
          >
            <Link to="/sign-in">Sign in Now</Link>
          </Button>
        </div>

        <div className="flex shrink-0">
          <img src={HeroImg} alt="dashboard image" />
        </div>
      </section>

      {/* Numbers Section */}
      <article className="mt-[88px] flex gap-12 items-center justify-center [&>div>h3]:text-secondaryColor [&>div>h3]:text-[40px] [&>div>h3]:text-center [&>div>h3]:font-semibold [&>div>h3]:mb-4 [&>div>p]:text-2xl [&>div>p]:text-grayColor">
        <div>
          <h3>7,500+</h3>
          <p>ad campaigns</p>
        </div>
        <div>
          <h3> 1,200+</h3>
          <p>Trusted marketers</p>
        </div>
        <div>
          <h3> 22+</h3>
          <p>countries</p>
        </div>
      </article>

      {/* Our Vision */}
      <section
        id="our-vision"
        className="mt-[88px] flex justify-between items-start gap-4"
      >
        {/* vision Text */}
        <div className="max-w-[630px] flex flex-col gap-8">
          <div className="w-[154px] h-12 flex items-center justify-center rounded-full bg-secondaryColor shadow text-white text-xl font-semibold">
            Our vision
          </div>
          <h2 className="font-rubik font-medium text-blackColor text-[54px]">
            <div className="inline-flex">
              <img src={TargetImg} alt="arrow hit the target" />
            </div>{" "}
            Boom! Your <span className="text-mainColor">Ads</span> Start{" "}
            <span className="text-secondaryColor">Now</span>
          </h2>
          <p className="text-xl text-grayColor">
            At Cliquify, we’re redefining modern advertising. Our vision is to
            build an intelligent, all-in-one platform
          </p>
          <Button
            asChild
            className="bg-mainColor hover:bg-mainColor text-white text-xl font-semibold w-[160px] h-[54px] rounded-lg"
          >
            <Link to="/sign-in">Join us Now</Link>
          </Button>
        </div>

        {/* vision Img */}
        <div className="flex shrink-0">
          <img src={LandImg} alt="world land" />
        </div>
      </section>

      {/* <footer className="mt-[88px]">
        <Link
          to="/privacy-policy"
          className="text-sm text-muted-foreground hover:underline"
        >
          Privacy Policy
        </Link>
        <Link
          to="/terms-of-services"
          className="text-sm text-muted-foreground hover:underline"
        >
          Terms of Service
        </Link>
      </footer> */}

      <footer className="mt-[88px] flex items-start gap-[26px] [&>div:not(:first-child)]:flex-1">
        <div className="flex shrink-0 min-w-[298px]">
          <img src={Logo} alt="cliquify logo" />
        </div>

        <div>
          <ul className="space-y-2">
            <li>
              <Link to="/" className="text-lg font-semibold hover:underline">
                Home
              </Link>
            </li>
            <li>
              <a
                href="#our-vision"
                className="font-medium text-grayColor hover:underline"
              >
                Our Vision
              </a>
            </li>
            <li>
              <Link to="/" className="font-medium text-grayColor hover:underline">
                Data Deletion
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <ul className="space-y-2">
            <li>
              <Link to="/" className="text-lg font-semibold hover:underline">
                About Us
              </Link>
            </li>
            <li>
              <Link to="/privacy-policy" className="font-medium text-grayColor hover:underline">
                Privacy Policy
              </Link>
            </li>
            <li>
              <Link to="/terms-of-services" className="font-medium text-grayColor hover:underline">
                Terms of Service
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <div className="flex shrink-0 mb-4">
            <img src={OtoLogo} alt="otomatika logo" />
          </div>
          <p className="font-medium text-lg">developed by <a href="https://www.otomatika.tech/" className="text-secondaryColor">otomatika</a></p>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;
