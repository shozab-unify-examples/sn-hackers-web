import { render, fireEvent } from "@testing-library/vue";
import Login from "@/views/Login.vue";
import Vuex from "vuex";
import Vue from "vue";
import axios from 'axios';

// Mock axios
jest.mock('axios');

// Set up Vue to use Vuex
Vue.use(Vuex);

describe("Login.vue", () => {
  let store;
  let actions;

  beforeEach(() => {
    // Reset axios mock
    axios.get.mockReset();
    axios.post.mockReset();

    // Set up Vuex store with mock login action
    actions = {
      login: jest.fn(),
    };

    store = new Vuex.Store({
      actions,
    });

    // Mock successful users fetch by default
    axios.get.mockResolvedValue({
      data: [
        { username: 'testuser1', password: 'pass1' },
        { username: 'testuser2', password: 'pass2' }
      ]
    });
  });

  const renderLogin = () => {
    return render(Login, {
      store,
    });
  };

  it("renders login form correctly", async () => {
    const { getByText, getByLabelText, getByRole } = renderLogin();

    // Check title and form elements
    expect(getByRole("heading", { name: "Login" })).toBeTruthy();
    expect(getByLabelText("Username")).toBeTruthy();
    expect(getByLabelText("Password")).toBeTruthy();
    expect(getByRole("button", { name: "Login" })).toBeTruthy();
  });

  it("shows available users from auth service", async () => {
    const { findByText } = renderLogin();

    // Wait for the users to be loaded and displayed
    expect(await findByText("testuser1/pass1")).toBeTruthy();
    expect(await findByText("testuser2/pass2")).toBeTruthy();
  });

  it("shows error when auth service is unavailable", async () => {
    axios.get.mockRejectedValue(new Error('Network error'));

    const { findByText } = renderLogin();

    expect(await findByText("Auth Service Currently Unavailable")).toBeTruthy();
  });

  it("allows user input in form fields", async () => {
    const { getByLabelText } = renderLogin();

    const usernameInput = getByLabelText("Username");
    const passwordInput = getByLabelText("Password");

    await fireEvent.update(usernameInput, "testuser");
    await fireEvent.update(passwordInput, "testpass");

    expect(usernameInput.value).toBe("testuser");
    expect(passwordInput.value).toBe("testpass");
  });

  it("calls login action with form data when submitted", async () => {
    const { getByLabelText, getByRole } = renderLogin();

    // Fill in the form
    await fireEvent.update(getByLabelText("Username"), "testuser");
    await fireEvent.update(getByLabelText("Password"), "testpass");

    // Submit the form
    await fireEvent.click(getByRole("button", { name: "Login" }));

    // Verify login action was called with correct data
    expect(actions.login).toHaveBeenCalledWith(expect.anything(), {
      username: "testuser",
      password: "testpass",
    });
  });

  it("fills in user credentials when helper link is clicked", async () => {
    const { findByText, getByLabelText } = renderLogin();

    // Wait for and click the first user link
    const userLink = await findByText("testuser1/pass1");
    await fireEvent.click(userLink);

    expect(getByLabelText("Username").value).toBe("testuser1");
    expect(getByLabelText("Password").value).toBe("pass1");
  });

  it("requires username and password fields", () => {
    const { getByLabelText } = renderLogin();

    const usernameInput = getByLabelText("Username");
    const passwordInput = getByLabelText("Password");

    expect(usernameInput.hasAttribute("required")).toBe(true);
    expect(passwordInput.hasAttribute("required")).toBe(true);
  });

  it("uses password type for password field", () => {
    const { getByLabelText } = renderLogin();

    const passwordInput = getByLabelText("Password");
    expect(passwordInput.getAttribute("type")).toBe("password");
  });

  it("prevents default form submission", async () => {
    const { container, getByRole } = renderLogin();
    const form = container.querySelector("form");
    const submitEvent = new Event("submit");
    const preventDefault = jest.fn();
    submitEvent.preventDefault = preventDefault;

    form.dispatchEvent(submitEvent);

    expect(preventDefault).toHaveBeenCalled();
  });

  it("shows loading state while fetching users", async () => {
    axios.get.mockImplementation(() => new Promise(() => { })); // Never resolves

    const { getByText } = renderLogin();
    expect(getByText("Loading available users...")).toBeTruthy();
  });

  it("shows retry button when users fetch fails", async () => {
    axios.get.mockRejectedValue(new Error('Network error'));

    const { findByRole } = renderLogin();
    const retryButton = await findByRole('button', { name: 'Retry' });

    // Click retry and verify it tries to fetch users again
    axios.get.mockResolvedValueOnce({ data: [] });
    await fireEvent.click(retryButton);
    expect(axios.get).toHaveBeenCalledTimes(2);
  });
});
