package net.bandoviet.user;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.stereotype.Controller;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.WebDataBinder;
import org.springframework.web.bind.annotation.InitBinder;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.servlet.ModelAndView;

import java.util.Map;
import java.util.NoSuchElementException;
import java.util.Optional;

import javax.validation.Valid;

import net.bandoviet.place.PlaceService;

/**
 * Sign in, sign up.
 * 
 * @author quocanh
 *
 */
@Controller
public class UserController {

  @Autowired
  PlaceService placeService;
  @Autowired
  UserService userService;
  @Autowired
  UserCreateFormValidator userCreateFormValidator;

  /**
   * Homepage
   * 
   * @param model
   *          communication between view and controller.
   * @return the login page if user has not yet connected or index page otherwise.
   */
  @RequestMapping(value = "/login", method = RequestMethod.GET)
  public String login(Map<String, Object> model, @RequestParam Optional<String> error) {
    model.put("places", placeService.getRandom(20));
    model.put("newuser", new UserCreateForm());
    if (error.isPresent()) {
      model.put("error", error);
    }
    return "login";
  }

  @RequestMapping("/users")
  public String users(Map<String, Object> model) {
    model.put("users", userService.getAllUsers());
    return "users";
  }

  @InitBinder("newuser")
  public void initBinder(WebDataBinder binder) {
    binder.addValidators(userCreateFormValidator);
  }

  // TODO: only admin can do
  @RequestMapping("/user/{id}")
  public ModelAndView getUserPage(@PathVariable Long id) {
    return new ModelAndView("index", "user", userService.getUserById(id)
        .orElseThrow(() -> new NoSuchElementException(String.format("User=%s not found", id))));
  }

  /**
   * Save the new user.
   */
  @RequestMapping(value = "/user/create", method = RequestMethod.POST)
  public String handleUserCreateForm(@Valid @ModelAttribute("newuser") UserCreateForm form,
      BindingResult bindingResult) {
    if (bindingResult.hasErrors()) {
      return "login";
    }
    try {
      userService.create(form);
    } catch (DataIntegrityViolationException e) {
      if (userService.getUserByEmail(form.getEmail()).isPresent()) {
        bindingResult.reject("email.exists", "Email already exists");
      } else {
        bindingResult.reject("An error happens when creating the new user");
      }
      return "login";
    }
    return "redirect:/index";
  }

}
